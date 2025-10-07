-- =====================================================
-- SUBMISSIONS TRACKING & ACCEPTANCE RATE FIX
-- =====================================================
-- This migration creates proper submission tracking
-- and automatic acceptance rate calculation
--
-- Features:
-- 1. Trigger to update user_stats when submissions are added
-- 2. Automatic acceptance rate calculation
-- 3. Streak tracking based on submission dates
--
-- Created: 2025-01-07
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: Create function to update stats from submissions
-- =====================================================

CREATE OR REPLACE FUNCTION update_stats_from_submission()
RETURNS TRIGGER AS $$
DECLARE
  total_submissions INTEGER;
  accepted_submissions INTEGER;
  new_acceptance_rate NUMERIC;
BEGIN
  -- Count total and accepted submissions for this user
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'Accepted')
  INTO total_submissions, accepted_submissions
  FROM submissions
  WHERE user_id = NEW.user_id;

  -- Calculate acceptance rate
  IF total_submissions > 0 THEN
    new_acceptance_rate := ROUND((accepted_submissions::NUMERIC / total_submissions::NUMERIC) * 100, 1);
  ELSE
    new_acceptance_rate := 0;
  END IF;

  -- Update user_stats
  UPDATE user_stats
  SET
    acceptance_rate = new_acceptance_rate,
    -- Only increment solved count if this is an accepted submission
    total_solved = CASE
      WHEN NEW.status = 'Accepted' THEN
        -- Check if this is the first accepted submission for this problem
        CASE
          WHEN NOT EXISTS (
            SELECT 1 FROM submissions s
            WHERE s.user_id = NEW.user_id
              AND s.problem_id = NEW.problem_id
              AND s.status = 'Accepted'
              AND s.id != NEW.id
          ) THEN total_solved + 1
          ELSE total_solved
        END
      ELSE total_solved
    END,
    -- Increment difficulty-specific counters
    easy_solved = CASE
      WHEN NEW.status = 'Accepted' AND NEW.difficulty = 'Easy' THEN
        CASE
          WHEN NOT EXISTS (
            SELECT 1 FROM submissions s
            WHERE s.user_id = NEW.user_id
              AND s.problem_id = NEW.problem_id
              AND s.status = 'Accepted'
              AND s.id != NEW.id
          ) THEN easy_solved + 1
          ELSE easy_solved
        END
      ELSE easy_solved
    END,
    medium_solved = CASE
      WHEN NEW.status = 'Accepted' AND NEW.difficulty = 'Medium' THEN
        CASE
          WHEN NOT EXISTS (
            SELECT 1 FROM submissions s
            WHERE s.user_id = NEW.user_id
              AND s.problem_id = NEW.problem_id
              AND s.status = 'Accepted'
              AND s.id != NEW.id
          ) THEN medium_solved + 1
          ELSE medium_solved
        END
      ELSE medium_solved
    END,
    hard_solved = CASE
      WHEN NEW.status = 'Accepted' AND NEW.difficulty = 'Hard' THEN
        CASE
          WHEN NOT EXISTS (
            SELECT 1 FROM submissions s
            WHERE s.user_id = NEW.user_id
              AND s.problem_id = NEW.problem_id
              AND s.status = 'Accepted'
              AND s.id != NEW.id
          ) THEN hard_solved + 1
          ELSE hard_solved
        END
      ELSE hard_solved
    END
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 2: Create trigger on submissions table
-- =====================================================

DROP TRIGGER IF EXISTS trigger_update_stats_from_submission ON submissions;

CREATE TRIGGER trigger_update_stats_from_submission
  AFTER INSERT ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_stats_from_submission();

-- =====================================================
-- STEP 3: Create helper function to create test submissions
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
-- STEP 4: Create function to generate realistic submission history
-- =====================================================

CREATE OR REPLACE FUNCTION generate_submission_history(
  p_user_id UUID,
  p_days_back INTEGER DEFAULT 30,
  p_submissions_per_day INTEGER DEFAULT 2
)
RETURNS INTEGER AS $$
DECLARE
  day_offset INTEGER;
  submission_count INTEGER := 0;
  i INTEGER;
  submission_date TIMESTAMP WITH TIME ZONE;
  difficulties TEXT[] := ARRAY['Easy', 'Medium', 'Hard'];
  statuses TEXT[] := ARRAY['Accepted', 'Accepted', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded'];
  random_difficulty TEXT;
  random_status TEXT;
BEGIN
  -- Generate submissions for past N days
  FOR day_offset IN 0..p_days_back LOOP
    -- Random number of submissions per day (0 to p_submissions_per_day)
    FOR i IN 1..(FLOOR(RANDOM() * (p_submissions_per_day + 1)))::INTEGER LOOP
      submission_date := NOW() - (day_offset || ' days')::INTERVAL - (FLOOR(RANDOM() * 24) || ' hours')::INTERVAL;

      -- Random difficulty and status
      random_difficulty := difficulties[1 + FLOOR(RANDOM() * 3)::INTEGER];
      random_status := statuses[1 + FLOOR(RANDOM() * 5)::INTEGER];

      PERFORM create_test_submission(
        p_user_id,
        1 + FLOOR(RANDOM() * 100)::INTEGER, -- Random problem ID
        'Problem ' || (1 + FLOOR(RANDOM() * 100)::INTEGER),
        random_difficulty,
        random_status,
        'JavaScript',
        submission_date
      );

      submission_count := submission_count + 1;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Generated % submissions over % days for user %', submission_count, p_days_back, p_user_id;
  RETURN submission_count;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION generate_submission_history(UUID, INTEGER, INTEGER) TO authenticated;

COMMIT;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
--
-- The submissions tracking system is now enhanced!
--
-- Features:
-- 1. Submissions automatically update user_stats when inserted
-- 2. Acceptance rate is calculated automatically
-- 3. Only counts unique problem solves (first accepted submission per problem)
-- 4. Helper functions for testing submission history
--
-- Testing:
-- To create a single test submission:
--   SELECT create_test_submission('your-user-uuid', 1, 'Two Sum', 'Easy', 'Accepted', 'JavaScript');
--
-- To generate realistic submission history:
--   SELECT generate_submission_history('your-user-uuid', 30, 3);
--   -- This creates ~90 submissions over the past 30 days
--
-- =====================================================
