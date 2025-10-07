-- =====================================================
-- FINAL CLEANUP MIGRATION
-- Purpose: Drop deprecated tables after consolidation
-- Run this AFTER verifying the main migration works
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: Final verification before cleanup
-- =====================================================

-- Verify all users have corresponding entries in user_stats
DO $$
DECLARE
  missing_stats_count integer;
BEGIN
  SELECT COUNT(*) INTO missing_stats_count
  FROM users u
  LEFT JOIN user_stats us ON u.user_id = us.user_id
  WHERE us.user_id IS NULL;

  IF missing_stats_count > 0 THEN
    RAISE NOTICE 'Warning: % users are missing stats entries', missing_stats_count;

    -- Auto-create missing stats
    INSERT INTO user_stats (user_id, current_streak)
    SELECT u.user_id, COALESCE(u.day_streak, 0)
    FROM users u
    LEFT JOIN user_stats us ON u.user_id = us.user_id
    WHERE us.user_id IS NULL
    ON CONFLICT (user_id) DO NOTHING;

    RAISE NOTICE 'Created missing stats entries';
  END IF;
END $$;

-- =====================================================
-- STEP 2: Drop the compatibility view
-- =====================================================
DROP VIEW IF EXISTS user_profiles_view;

-- =====================================================
-- STEP 3: Drop deprecated tables
-- =====================================================

-- Drop user_profiles table (data migrated to users)
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop user_profile table (data migrated to users)
DROP TABLE IF EXISTS user_profile CASCADE;

-- =====================================================
-- STEP 4: Drop backup tables (if you're confident)
-- Comment these out if you want to keep backups longer
-- =====================================================

-- DROP TABLE IF EXISTS _backup_user_profiles;
-- DROP TABLE IF EXISTS _backup_user_profile;

COMMENT ON TABLE _backup_user_profiles IS 'Backup of user_profiles before consolidation. Safe to drop after verification period.';
COMMENT ON TABLE _backup_user_profile IS 'Backup of user_profile before consolidation. Safe to drop after verification period.';

-- =====================================================
-- STEP 5: Clean up any remaining unused columns
-- =====================================================

-- Optionally drop daily_streak if everything uses day_streak now
-- ALTER TABLE users DROP COLUMN IF EXISTS daily_streak;

-- =====================================================
-- STEP 6: Add final documentation
-- =====================================================

COMMENT ON DATABASE postgres IS 'Database schema consolidated on 2025-01-02. User data unified into single users table with user_stats for metrics.';

COMMIT;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database cleanup complete!';
  RAISE NOTICE '✅ Deprecated tables dropped: user_profiles, user_profile';
  RAISE NOTICE '✅ All user data consolidated into: users + user_stats';
  RAISE NOTICE '📝 Backup tables preserved: _backup_user_profiles, _backup_user_profile';
END $$;
