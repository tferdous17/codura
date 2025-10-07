-- =====================================================
-- SAFE USER PROGRESS SYSTEM UPGRADE
-- =====================================================
-- This migration safely upgrades your existing database
-- without breaking or duplicating anything
--
-- Changes:
-- 1. Adds columns to existing user_problem_progress table
-- 2. Adds last_submission_date to user_stats
-- 3. Creates/updates all functions and triggers
-- 4. Seeds achievements (with conflict handling)
--
-- Safe for existing data!
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: Upgrade user_problem_progress table
-- =====================================================

-- Add new columns to existing table (keeps your current columns)
ALTER TABLE user_problem_progress
ADD COLUMN IF NOT EXISTS first_solved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS total_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS accepted_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS difficulty TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_problem_progress_user_id ON user_problem_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_problem_progress_solved ON user_problem_progress(user_id, first_solved_at) WHERE first_solved_at IS NOT NULL;

-- Backfill difficulty from problems table
UPDATE user_problem_progress upp
SET difficulty = p.difficulty
FROM problems p
WHERE upp.problem_id = p.id
  AND upp.difficulty IS NULL;

-- Backfill first_solved_at from existing status
UPDATE user_problem_progress
SET first_solved_at = last_attempted_at
WHERE status = 'Solved'
  AND first_solved_at IS NULL;

-- Backfill total_attempts (estimate from existing data)
UPDATE user_problem_progress
SET total_attempts = CASE
  WHEN status = 'Solved' THEN 1  -- At minimum, 1 successful attempt
  WHEN status = 'Attempted' THEN 1
  ELSE 0
END
WHERE total_attempts = 0;

-- Backfill accepted_attempts
UPDATE user_problem_progress
SET accepted_attempts = CASE
  WHEN status = 'Solved' THEN 1
  ELSE 0
END
WHERE accepted_attempts = 0;

-- =====================================================
-- STEP 2: Add missing column to user_stats
-- =====================================================

ALTER TABLE user_stats
ADD COLUMN IF NOT EXISTS last_submission_date DATE;

-- =====================================================
-- STEP 3: Create/Replace submission tracking function
-- =====================================================

CREATE OR REPLACE FUNCTION update_stats_from_submission()
RETURNS TRIGGER AS $$
DECLARE
  total_submissions_count INTEGER;
  accepted_submissions_count INTEGER;
  new_acceptance_rate NUMERIC;
  is_first_solve BOOLEAN;
  progress_record RECORD;
BEGIN
  -- =========================================
  -- PART 1: Update user_problem_progress
  -- =========================================

  -- Check if this problem exists in user's progress
  SELECT * INTO progress_record
  FROM user_problem_progress
  WHERE user_id = NEW.user_id AND problem_id = NEW.problem_id;

  IF progress_record IS NULL THEN
    -- First time attempting this problem
    INSERT INTO user_problem_progress (
      user_id,
      problem_id,
      status,
      difficulty,
      total_attempts,
      accepted_attempts,
      first_solved_at,
      last_attempted_at
    ) VALUES (
      NEW.user_id,
      NEW.problem_id,
      CASE WHEN NEW.status = 'Accepted' THEN 'Solved' ELSE 'Attempted' END,
      NEW.difficulty,
      1,
      CASE WHEN NEW.status = 'Accepted' THEN 1 ELSE 0 END,
      CASE WHEN NEW.status = 'Accepted' THEN NEW.submitted_at ELSE NULL END,
      NEW.submitted_at
    );

    is_first_solve := (NEW.status = 'Accepted');
  ELSE
    -- User has attempted this problem before
    is_first_solve := (progress_record.first_solved_at IS NULL AND NEW.status = 'Accepted');

    UPDATE user_problem_progress
    SET
      status = CASE
        WHEN NEW.status = 'Accepted' THEN 'Solved'
        WHEN status = 'Solved' THEN 'Solved'  -- Keep solved status
        ELSE 'Attempted'
      END,
      total_attempts = total_attempts + 1,
      accepted_attempts = CASE WHEN NEW.status = 'Accepted' THEN accepted_attempts + 1 ELSE accepted_attempts END,
      first_solved_at = CASE
        WHEN first_solved_at IS NULL AND NEW.status = 'Accepted' THEN NEW.submitted_at
        ELSE first_solved_at
      END,
      last_attempted_at = NEW.submitted_at,
      last_submission_id = NEW.id
    WHERE user_id = NEW.user_id AND problem_id = NEW.problem_id;
  END IF;

  -- =========================================
  -- PART 2: Calculate acceptance rate
  -- =========================================

  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'Accepted')
  INTO total_submissions_count, accepted_submissions_count
  FROM submissions
  WHERE user_id = NEW.user_id;

  IF total_submissions_count > 0 THEN
    new_acceptance_rate := ROUND((accepted_submissions_count::NUMERIC / total_submissions_count::NUMERIC) * 100, 1);
  ELSE
    new_acceptance_rate := 0;
  END IF;

  -- =========================================
  -- PART 3: Update user_stats
  -- =========================================

  UPDATE user_stats
  SET
    -- Acceptance rate
    acceptance_rate = new_acceptance_rate,

    -- Total solved (only increment if first time solving this problem)
    total_solved = CASE
      WHEN is_first_solve THEN total_solved + 1
      ELSE total_solved
    END,

    -- Difficulty-specific counters (only increment on first solve)
    easy_solved = CASE
      WHEN is_first_solve AND NEW.difficulty = 'Easy' THEN easy_solved + 1
      ELSE easy_solved
    END,

    medium_solved = CASE
      WHEN is_first_solve AND NEW.difficulty = 'Medium' THEN medium_solved + 1
      ELSE medium_solved
    END,

    hard_solved = CASE
      WHEN is_first_solve AND NEW.difficulty = 'Hard' THEN hard_solved + 1
      ELSE hard_solved
    END,

    updated_at = NOW()
  WHERE user_id = NEW.user_id;

  -- =========================================
  -- PART 4: Update streak (if solved today)
  -- =========================================

  IF is_first_solve THEN
    PERFORM update_user_streak(NEW.user_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 4: Create/Replace streak calculation function
-- =====================================================

CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  last_solve_date DATE;
  today DATE := CURRENT_DATE;
  yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
  current_streak_val INTEGER;
BEGIN
  -- Get the most recent solve date before today
  SELECT DATE(first_solved_at) INTO last_solve_date
  FROM user_problem_progress
  WHERE user_id = p_user_id
    AND first_solved_at IS NOT NULL
    AND DATE(first_solved_at) < today
  ORDER BY first_solved_at DESC
  LIMIT 1;

  -- Calculate streak
  IF last_solve_date IS NULL THEN
    -- First problem ever solved
    current_streak_val := 1;
  ELSIF last_solve_date = yesterday THEN
    -- Solved yesterday, streak continues
    SELECT current_streak INTO current_streak_val
    FROM user_stats
    WHERE user_id = p_user_id;

    current_streak_val := COALESCE(current_streak_val, 0) + 1;
  ELSIF last_solve_date = today THEN
    -- Already solved today, don't change streak
    SELECT current_streak INTO current_streak_val
    FROM user_stats
    WHERE user_id = p_user_id;

    current_streak_val := COALESCE(current_streak_val, 1);
  ELSE
    -- Streak broken, start over
    current_streak_val := 1;
  END IF;

  -- Update stats
  UPDATE user_stats
  SET
    current_streak = current_streak_val,
    longest_streak = GREATEST(COALESCE(longest_streak, 0), current_streak_val),
    last_submission_date = today,
    updated_at = NOW()
  WHERE user_id = p_user_id;

END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 5: Create/Replace triggers
-- =====================================================

DROP TRIGGER IF EXISTS trigger_update_stats_from_submission ON submissions;

CREATE TRIGGER trigger_update_stats_from_submission
  AFTER INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_stats_from_submission();

-- =====================================================
-- STEP 6: Create/Replace achievement functions
-- =====================================================

CREATE OR REPLACE FUNCTION check_and_award_achievement(
  p_user_id UUID,
  p_requirement_type TEXT,
  p_current_value INTEGER
)
RETURNS void AS $$
DECLARE
  achievement_record RECORD;
BEGIN
  FOR achievement_record IN
    SELECT a.id, a.name, a.requirement_value
    FROM achievements a
    WHERE a.requirement_type = p_requirement_type
      AND a.requirement_value <= p_current_value
      AND NOT EXISTS (
        SELECT 1
        FROM user_achievements ua
        WHERE ua.user_id = p_user_id
          AND ua.achievement_id = a.id
      )
  LOOP
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, achievement_record.id)
    ON CONFLICT (user_id, achievement_id) DO NOTHING;

    RAISE NOTICE 'Achievement awarded: % to user %', achievement_record.name, p_user_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_achievements_on_stats_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Check all achievement types
  IF NEW.total_solved != OLD.total_solved THEN
    PERFORM check_and_award_achievement(NEW.user_id, 'problems_solved', NEW.total_solved);
  END IF;

  IF NEW.hard_solved != OLD.hard_solved THEN
    PERFORM check_and_award_achievement(NEW.user_id, 'hard_solved', NEW.hard_solved);
  END IF;

  IF NEW.easy_solved != OLD.easy_solved THEN
    PERFORM check_and_award_achievement(NEW.user_id, 'easy_solved', NEW.easy_solved);
  END IF;

  IF NEW.medium_solved != OLD.medium_solved THEN
    PERFORM check_and_award_achievement(NEW.user_id, 'medium_solved', NEW.medium_solved);
  END IF;

  IF NEW.current_streak != OLD.current_streak THEN
    PERFORM check_and_award_achievement(NEW.user_id, 'streak', NEW.current_streak);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_check_achievements_on_stats_update ON user_stats;

CREATE TRIGGER trigger_check_achievements_on_stats_update
  AFTER UPDATE ON user_stats
  FOR EACH ROW
  WHEN (
    NEW.total_solved != OLD.total_solved OR
    NEW.hard_solved != OLD.hard_solved OR
    NEW.easy_solved != OLD.easy_solved OR
    NEW.medium_solved != OLD.medium_solved OR
    NEW.current_streak != OLD.current_streak
  )
  EXECUTE FUNCTION check_achievements_on_stats_update();

-- =====================================================
-- STEP 7: Seed achievements (safe - won't duplicate)
-- =====================================================

INSERT INTO achievements (name, description, icon, color, requirement_type, requirement_value) VALUES
  -- Beginner tier
  ('First Steps', 'Solved your first problem', 'Code', 'text-blue-400', 'problems_solved', 1),
  ('Getting Started', 'Solved 5 problems', 'CheckCircle', 'text-blue-500', 'problems_solved', 5),

  -- Consistency tier
  ('Daily Coder', '3 day streak', 'Flame', 'text-orange-400', 'streak', 3),
  ('Week Warrior', '7 day streak', 'Flame', 'text-orange-500', 'streak', 7),
  ('Dedicated', '14 day streak', 'Fire', 'text-orange-600', 'streak', 14),
  ('Unstoppable', '30 day streak', 'Zap', 'text-orange-700', 'streak', 30),

  -- Volume tier
  ('Problem Solver', 'Solved 10 problems', 'Target', 'text-green-400', 'problems_solved', 10),
  ('Enthusiast', 'Solved 25 problems', 'TrendingUp', 'text-green-500', 'problems_solved', 25),
  ('Dedicated Solver', 'Solved 50 problems', 'Award', 'text-green-600', 'problems_solved', 50),
  ('Century Club', 'Solved 100 problems', 'Trophy', 'text-yellow-500', 'problems_solved', 100),
  ('Elite Coder', 'Solved 250 problems', 'Crown', 'text-yellow-600', 'problems_solved', 250),
  ('Legend', 'Solved 500 problems', 'Star', 'text-purple-600', 'problems_solved', 500),

  -- Difficulty tier
  ('Hard Starter', 'Solved 1 hard problem', 'Sparkles', 'text-red-400', 'hard_solved', 1),
  ('Hard Challenger', 'Solved 5 hard problems', 'Zap', 'text-red-500', 'hard_solved', 5),
  ('Hard Expert', 'Solved 10 hard problems', 'Star', 'text-red-600', 'hard_solved', 10),
  ('Hard Master', 'Solved 20 hard problems', 'Crown', 'text-red-700', 'hard_solved', 20),
  ('Hard Legend', 'Solved 50 hard problems', 'Trophy', 'text-red-800', 'hard_solved', 50),

  -- Easy/Medium tiers
  ('Easy Master', 'Solved 50 easy problems', 'Check', 'text-emerald-500', 'easy_solved', 50),
  ('Medium Master', 'Solved 50 medium problems', 'Target', 'text-amber-500', 'medium_solved', 50)

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  requirement_type = EXCLUDED.requirement_type,
  requirement_value = EXCLUDED.requirement_value;

-- =====================================================
-- STEP 8: Create helpful views (if not exists)
-- =====================================================

CREATE OR REPLACE VIEW user_achievements_with_details AS
SELECT
  ua.user_id,
  ua.achievement_id,
  ua.earned_at,
  a.name,
  a.description,
  a.icon,
  a.color,
  a.requirement_type,
  a.requirement_value
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.id;

GRANT SELECT ON user_achievements_with_details TO authenticated;

-- =====================================================
-- STEP 9: Create achievement summary function
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_achievement_summary(p_user_id UUID)
RETURNS TABLE (
  total_achievements INTEGER,
  latest_achievement_name TEXT,
  latest_achievement_date TIMESTAMP WITH TIME ZONE,
  achievement_progress JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_achievements,
    (
      SELECT a.name
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = p_user_id
      ORDER BY ua.earned_at DESC
      LIMIT 1
    ) as latest_achievement_name,
    (
      SELECT ua.earned_at
      FROM user_achievements ua
      WHERE ua.user_id = p_user_id
      ORDER BY ua.earned_at DESC
      LIMIT 1
    ) as latest_achievement_date,
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'name', a.name,
          'description', a.description,
          'icon', a.icon,
          'color', a.color,
          'earned_at', ua.earned_at
        )
        ORDER BY ua.earned_at DESC
      )
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.user_id = p_user_id
    ) as achievement_progress
  FROM user_achievements ua
  WHERE ua.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_user_achievement_summary(UUID) TO authenticated;

-- =====================================================
-- STEP 10: Backfill functions
-- =====================================================

CREATE OR REPLACE FUNCTION backfill_achievements_for_user(p_user_id UUID)
RETURNS void AS $$
DECLARE
  user_stats_record RECORD;
BEGIN
  SELECT * INTO user_stats_record
  FROM user_stats
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE NOTICE 'No stats found for user %', p_user_id;
    RETURN;
  END IF;

  PERFORM check_and_award_achievement(p_user_id, 'problems_solved', user_stats_record.total_solved);
  PERFORM check_and_award_achievement(p_user_id, 'hard_solved', user_stats_record.hard_solved);
  PERFORM check_and_award_achievement(p_user_id, 'easy_solved', user_stats_record.easy_solved);
  PERFORM check_and_award_achievement(p_user_id, 'medium_solved', user_stats_record.medium_solved);
  PERFORM check_and_award_achievement(p_user_id, 'streak', user_stats_record.current_streak);

  RAISE NOTICE 'Backfilled achievements for user %', p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION backfill_achievements_for_user(UUID) TO authenticated;

-- =====================================================
-- STEP 11: Test submission helper
-- =====================================================

CREATE OR REPLACE FUNCTION create_test_submission(
  p_user_id UUID,
  p_problem_id INTEGER DEFAULT 1,
  p_problem_title TEXT DEFAULT 'Test Problem',
  p_difficulty TEXT DEFAULT 'Easy',
  p_status TEXT DEFAULT 'Accepted',
  p_language TEXT DEFAULT 'JavaScript',
  p_submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS UUID AS $$
DECLARE
  new_submission_id UUID;
BEGIN
  INSERT INTO submissions (
    user_id,
    problem_id,
    problem_title,
    difficulty,
    status,
    language,
    submitted_at
  )
  VALUES (
    p_user_id,
    p_problem_id,
    p_problem_title,
    p_difficulty,
    p_status,
    p_language,
    p_submitted_at
  )
  RETURNING id INTO new_submission_id;

  RAISE NOTICE 'Created submission % for user %', new_submission_id, p_user_id;
  RETURN new_submission_id;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION create_test_submission(UUID, INTEGER, TEXT, TEXT, TEXT, TEXT, TIMESTAMP WITH TIME ZONE) TO authenticated;

-- =====================================================
-- STEP 12: Grant permissions
-- =====================================================

GRANT SELECT ON achievements TO authenticated;
GRANT SELECT ON user_achievements TO authenticated;
GRANT INSERT ON user_achievements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_problem_progress TO authenticated;

COMMIT;

-- =====================================================
-- MIGRATION COMPLETE - SAFE UPGRADE
-- =====================================================
--
-- What Changed:
-- ✅ Added columns to user_problem_progress (kept existing ones)
-- ✅ Added last_submission_date to user_stats
-- ✅ Created all functions and triggers
-- ✅ Seeded achievements (no duplicates)
-- ✅ Backfilled data from existing records
--
-- Your existing data is SAFE and PRESERVED!
--
-- Next Steps:
-- 1. Run this migration
-- 2. Test with: SELECT create_test_submission('your-user-uuid');
-- 3. Verify stats updated: SELECT * FROM user_stats WHERE user_id = 'your-user-uuid';
--
-- =====================================================
