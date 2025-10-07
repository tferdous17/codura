-- =====================================================
-- ACHIEVEMENTS SYSTEM - TESTING & VERIFICATION QUERIES
-- =====================================================
-- Quick reference for testing the achievements system
-- Run these queries to verify everything works correctly
-- =====================================================

-- =====================================================
-- SECTION 1: VERIFY MIGRATION SUCCESS
-- =====================================================

-- 1.1 Check all achievements are loaded (should return 19 rows)
SELECT
  name,
  requirement_type,
  requirement_value,
  icon,
  color
FROM achievements
ORDER BY requirement_type, requirement_value;

-- 1.2 Verify triggers exist
SELECT
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger
WHERE tgname LIKE '%achievement%';

-- 1.3 Check functions exist
SELECT
  proname as function_name,
  prosrc as source_preview
FROM pg_proc
WHERE proname LIKE '%achievement%';

-- =====================================================
-- SECTION 2: CHECK USER ACHIEVEMENTS
-- =====================================================

-- 2.1 Get all achievements for current user
-- Replace 'your-user-uuid' with actual user ID
SELECT
  name,
  description,
  icon,
  color,
  earned_at,
  requirement_value
FROM user_achievements_with_details
WHERE user_id = 'your-user-uuid'
ORDER BY earned_at DESC;

-- 2.2 Get achievement summary for current user
SELECT * FROM get_user_achievement_summary('your-user-uuid');

-- 2.3 Count achievements by user
SELECT
  u.full_name,
  u.username,
  COUNT(ua.achievement_id) as total_achievements
FROM users u
LEFT JOIN user_achievements ua ON u.user_id = ua.user_id
GROUP BY u.user_id, u.full_name, u.username
ORDER BY total_achievements DESC;

-- =====================================================
-- SECTION 3: TEST AUTOMATIC AWARDING
-- =====================================================

-- 3.1 Check current user stats before update
SELECT
  user_id,
  total_solved,
  easy_solved,
  medium_solved,
  hard_solved,
  current_streak
FROM user_stats
WHERE user_id = 'your-user-uuid';

-- 3.2 Simulate solving an easy problem (triggers achievement check)
UPDATE user_stats
SET
  total_solved = total_solved + 1,
  easy_solved = easy_solved + 1
WHERE user_id = 'your-user-uuid';

-- 3.3 Check if new achievements were awarded
SELECT
  name,
  description,
  earned_at
FROM user_achievements_with_details
WHERE user_id = 'your-user-uuid'
ORDER BY earned_at DESC
LIMIT 5;

-- 3.4 Simulate building a streak
UPDATE user_stats
SET current_streak = 7
WHERE user_id = 'your-user-uuid';

-- Check for "Week Warrior" achievement
SELECT name, earned_at
FROM user_achievements_with_details
WHERE user_id = 'your-user-uuid'
  AND name = 'Week Warrior';

-- =====================================================
-- SECTION 4: MANUAL BACKFILL (if needed)
-- =====================================================

-- 4.1 Backfill achievements for a specific user
SELECT backfill_achievements_for_user('your-user-uuid');

-- 4.2 Backfill achievements for ALL users
DO $$
DECLARE
  user_record RECORD;
  backfill_count INTEGER := 0;
BEGIN
  FOR user_record IN SELECT user_id FROM users
  LOOP
    PERFORM backfill_achievements_for_user(user_record.user_id);
    backfill_count := backfill_count + 1;
  END LOOP;

  RAISE NOTICE 'Backfilled achievements for % users', backfill_count;
END $$;

-- =====================================================
-- SECTION 5: ANALYTICS & INSIGHTS
-- =====================================================

-- 5.1 Most earned achievements
SELECT
  a.name,
  a.description,
  COUNT(ua.user_id) as times_earned
FROM achievements a
LEFT JOIN user_achievements ua ON a.id = ua.achievement_id
GROUP BY a.id, a.name, a.description
ORDER BY times_earned DESC;

-- 5.2 Rarest achievements (least earned)
SELECT
  a.name,
  a.description,
  a.requirement_value,
  COUNT(ua.user_id) as times_earned
FROM achievements a
LEFT JOIN user_achievements ua ON a.id = ua.achievement_id
GROUP BY a.id, a.name, a.description, a.requirement_value
HAVING COUNT(ua.user_id) < 5
ORDER BY times_earned ASC;

-- 5.3 Users closest to earning their next achievement
WITH user_progress AS (
  SELECT
    u.user_id,
    u.full_name,
    u.username,
    s.total_solved,
    s.hard_solved,
    s.current_streak,
    COUNT(ua.achievement_id) as achievements_earned
  FROM users u
  JOIN user_stats s ON u.user_id = s.user_id
  LEFT JOIN user_achievements ua ON u.user_id = ua.user_id
  GROUP BY u.user_id, u.full_name, u.username, s.total_solved, s.hard_solved, s.current_streak
)
SELECT
  up.full_name,
  up.username,
  up.achievements_earned,
  up.total_solved,
  up.current_streak,
  a.name as next_achievement,
  a.requirement_value - up.total_solved as problems_away
FROM user_progress up
CROSS JOIN LATERAL (
  SELECT * FROM achievements a
  WHERE a.requirement_type = 'problems_solved'
    AND a.requirement_value > up.total_solved
    AND NOT EXISTS (
      SELECT 1 FROM user_achievements ua2
      WHERE ua2.user_id = up.user_id
        AND ua2.achievement_id = a.id
    )
  ORDER BY a.requirement_value ASC
  LIMIT 1
) a
ORDER BY problems_away ASC
LIMIT 10;

-- 5.4 Achievement earning timeline (last 7 days)
SELECT
  DATE(ua.earned_at) as date,
  COUNT(*) as achievements_earned,
  COUNT(DISTINCT ua.user_id) as unique_users
FROM user_achievements ua
WHERE ua.earned_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(ua.earned_at)
ORDER BY date DESC;

-- =====================================================
-- SECTION 6: ADD NEW ACHIEVEMENTS (Examples)
-- =====================================================

-- 6.1 Add a "Perfectionist" achievement
INSERT INTO achievements (name, description, icon, color, requirement_type, requirement_value)
VALUES (
  'Perfectionist',
  '100% acceptance rate on 50+ problems',
  'Star',
  'text-yellow-600',
  'acceptance_rate',
  100
)
ON CONFLICT (name) DO NOTHING;

-- 6.2 Add a "Marathon Runner" achievement
INSERT INTO achievements (name, description, icon, color, requirement_type, requirement_value)
VALUES (
  'Marathon Runner',
  'Solved 1000 problems',
  'Trophy',
  'text-purple-700',
  'problems_solved',
  1000
)
ON CONFLICT (name) DO NOTHING;

-- 6.3 Add a "Streak Legend" achievement
INSERT INTO achievements (name, description, icon, color, requirement_type, requirement_value)
VALUES (
  'Streak Legend',
  'Maintained a 100 day streak',
  'Fire',
  'text-orange-800',
  'streak',
  100
)
ON CONFLICT (name) DO NOTHING;

-- Note: After adding new achievements, backfill for existing users:
-- SELECT backfill_achievements_for_user('your-user-uuid');

-- =====================================================
-- SECTION 7: CLEANUP & MAINTENANCE
-- =====================================================

-- 7.1 Remove duplicate achievements (safety check)
DELETE FROM user_achievements ua1
WHERE EXISTS (
  SELECT 1 FROM user_achievements ua2
  WHERE ua1.user_id = ua2.user_id
    AND ua1.achievement_id = ua2.achievement_id
    AND ua1.earned_at > ua2.earned_at
);

-- 7.2 Find users with missing stats
SELECT u.user_id, u.full_name, u.username
FROM users u
LEFT JOIN user_stats s ON u.user_id = s.user_id
WHERE s.user_id IS NULL;

-- 7.3 Recalculate all user stats and re-award achievements
-- (Use with caution - only if data integrity issues)
/*
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT user_id FROM users
  LOOP
    -- Delete existing achievements
    DELETE FROM user_achievements WHERE user_id = user_record.user_id;

    -- Re-award based on current stats
    PERFORM backfill_achievements_for_user(user_record.user_id);

    RAISE NOTICE 'Recalculated achievements for user %', user_record.user_id;
  END LOOP;
END $$;
*/

-- =====================================================
-- SECTION 8: PERFORMANCE MONITORING
-- =====================================================

-- 8.1 Check index usage on user_achievements
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE tablename = 'user_achievements'
ORDER BY idx_scan DESC;

-- 8.2 Check trigger execution count (requires pg_stat_statements extension)
-- SELECT * FROM pg_stat_statements
-- WHERE query LIKE '%check_achievements%'
-- ORDER BY calls DESC;

-- 8.3 Average achievements per user
SELECT
  AVG(achievement_count) as avg_achievements,
  MAX(achievement_count) as max_achievements,
  MIN(achievement_count) as min_achievements
FROM (
  SELECT
    user_id,
    COUNT(*) as achievement_count
  FROM user_achievements
  GROUP BY user_id
) as user_achievement_counts;

-- =====================================================
-- QUICK TESTING SCRIPT
-- =====================================================

-- Run this to quickly test the system with your user ID:
-- Replace 'your-user-uuid' throughout

DO $$
DECLARE
  test_user_id UUID := 'your-user-uuid'; -- CHANGE THIS
  before_count INTEGER;
  after_count INTEGER;
BEGIN
  -- Count achievements before
  SELECT COUNT(*) INTO before_count
  FROM user_achievements
  WHERE user_id = test_user_id;

  RAISE NOTICE 'User has % achievements before update', before_count;

  -- Simulate solving 5 problems
  UPDATE user_stats
  SET total_solved = total_solved + 5,
      easy_solved = easy_solved + 3,
      medium_solved = medium_solved + 2
  WHERE user_id = test_user_id;

  -- Count achievements after
  SELECT COUNT(*) INTO after_count
  FROM user_achievements
  WHERE user_id = test_user_id;

  RAISE NOTICE 'User has % achievements after update', after_count;
  RAISE NOTICE 'Awarded % new achievements!', (after_count - before_count);

  -- Show newly earned achievements
  RAISE NOTICE 'Newly earned achievements:';
  FOR rec IN
    SELECT name, earned_at
    FROM user_achievements_with_details
    WHERE user_id = test_user_id
    ORDER BY earned_at DESC
    LIMIT 5
  LOOP
    RAISE NOTICE '  - % (earned at %)', rec.name, rec.earned_at;
  END LOOP;
END $$;

-- =====================================================
-- END OF TEST QUERIES
-- =====================================================
