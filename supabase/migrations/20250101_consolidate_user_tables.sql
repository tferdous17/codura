-- =====================================================
-- COMPREHENSIVE DATABASE CONSOLIDATION MIGRATION
-- Purpose: Merge redundant user tables and clean up database
-- Tables affected: users, user_profiles, user_profile
-- =====================================================

BEGIN;

-- =====================================================
-- STEP 1: Backup existing data (for safety)
-- =====================================================
CREATE TABLE IF NOT EXISTS _backup_user_profiles AS SELECT * FROM user_profiles;
CREATE TABLE IF NOT EXISTS _backup_user_profile AS SELECT * FROM user_profile;

-- =====================================================
-- STEP 2: Add missing columns to 'users' table
-- Consolidating fields from user_profiles and user_profile
-- =====================================================

-- Add columns from user_profiles (if not exists)
ALTER TABLE users ADD COLUMN IF NOT EXISTS username text UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS university text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS graduation_year text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_username text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_username text;

-- Add columns from user_profile (if not exists)
ALTER TABLE users ADD COLUMN IF NOT EXISTS day_streak integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS mock_interviews integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS university_rank integer;
ALTER TABLE users ADD COLUMN IF NOT EXISTS topics_studying text[] DEFAULT '{}';

-- Add timestamps
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- =====================================================
-- STEP 3: Migrate data from user_profiles to users
-- =====================================================
UPDATE users u
SET
  username = up.username,
  bio = up.bio,
  avatar_url = COALESCE(u.avatar_url, up.avatar_url),
  university = up.university,
  graduation_year = up.graduation_year,
  location = up.location,
  job_title = up.job_title,
  website = up.website,
  github_username = up.github_username,
  linkedin_username = up.linkedin_username,
  created_at = COALESCE(u.created_at, up.created_at),
  updated_at = COALESCE(u.updated_at, up.updated_at)
FROM user_profiles up
WHERE u.user_id = up.id;

-- =====================================================
-- STEP 4: Migrate data from user_profile to users
-- =====================================================
UPDATE users u
SET
  day_streak = COALESCE(upr.day_streak, u.daily_streak, 0),
  mock_interviews = COALESCE(upr.mock_interviews, 0),
  university_rank = upr.university_rank,
  topics_studying = COALESCE(upr.topics_studying, '{}')
FROM user_profile upr
WHERE u.user_id = upr.user_id;

-- =====================================================
-- STEP 5: Ensure user_stats exists for all users
-- =====================================================
INSERT INTO user_stats (user_id, total_solved, easy_solved, medium_solved, hard_solved, current_streak)
SELECT
  u.user_id,
  0,
  0,
  0,
  0,
  COALESCE(u.day_streak, 0)
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_stats us WHERE us.user_id = u.user_id
)
ON CONFLICT (user_id) DO NOTHING;

-- Sync streak values between users and user_stats
UPDATE user_stats us
SET current_streak = u.day_streak
FROM users u
WHERE us.user_id = u.user_id AND u.day_streak > 0;

-- =====================================================
-- STEP 6: Drop foreign key constraints referencing old tables
-- =====================================================

-- Drop constraints on user_profiles
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- =====================================================
-- STEP 7: Update RLS policies to reference 'users' table
-- (We'll keep the tables for now but disable them)
-- =====================================================

-- Disable RLS on old tables (we'll drop them later)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile DISABLE ROW LEVEL SECURITY;

-- Enable RLS on users table if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON users;
DROP POLICY IF EXISTS "Service role can insert users" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile." ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile." ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;

-- Create new comprehensive RLS policies for users table
CREATE POLICY "Anyone can view user profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- STEP 8: Clean up unused/redundant columns
-- =====================================================

-- Remove redundant 'daily_streak' from users (we now use 'day_streak')
-- We'll keep it for now and sync it in a trigger

-- =====================================================
-- STEP 9: Create indexes for performance
-- =====================================================

-- Index on username for lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Index on email for lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index on questionnaire_completed for filtering
CREATE INDEX IF NOT EXISTS idx_users_questionnaire_completed ON users(questionnaire_completed);

-- =====================================================
-- STEP 10: Create trigger to keep daily_streak in sync
-- =====================================================

CREATE OR REPLACE FUNCTION sync_user_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync day_streak to daily_streak for backward compatibility
  IF NEW.day_streak IS DISTINCT FROM OLD.day_streak THEN
    NEW.daily_streak := NEW.day_streak;
  ELSIF NEW.daily_streak IS DISTINCT FROM OLD.daily_streak THEN
    NEW.day_streak := NEW.daily_streak;
  END IF;

  -- Update timestamp
  NEW.updated_at := now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_user_streak ON users;
CREATE TRIGGER trigger_sync_user_streak
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_streak();

-- =====================================================
-- STEP 11: Create trigger to auto-create user_stats
-- =====================================================

CREATE OR REPLACE FUNCTION create_user_stats_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user_stats entry automatically
  INSERT INTO user_stats (user_id, current_streak)
  VALUES (NEW.user_id, COALESCE(NEW.day_streak, 0))
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_user_stats ON users;
CREATE TRIGGER trigger_create_user_stats
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_stats_on_signup();

-- =====================================================
-- STEP 12: Create trigger to sync stats between tables
-- =====================================================

CREATE OR REPLACE FUNCTION sync_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- When user_stats changes, update users table
  UPDATE users
  SET
    day_streak = NEW.current_streak,
    updated_at = now()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_user_stats ON user_stats;
CREATE TRIGGER trigger_sync_user_stats
  AFTER UPDATE ON user_stats
  FOR EACH ROW
  WHEN (OLD.current_streak IS DISTINCT FROM NEW.current_streak)
  EXECUTE FUNCTION sync_user_stats();

-- =====================================================
-- STEP 13: Create view for backward compatibility
-- (Optional: helps during transition period)
-- =====================================================

CREATE OR REPLACE VIEW user_profiles_view AS
SELECT
  user_id as id,
  username,
  full_name,
  bio,
  avatar_url,
  university,
  graduation_year,
  location,
  job_title,
  website,
  github_username,
  linkedin_username,
  created_at,
  updated_at
FROM users;

-- =====================================================
-- STEP 14: Add comment for documentation
-- =====================================================

COMMENT ON TABLE users IS 'Unified user table containing all user profile and onboarding data. Replaces user_profiles and user_profile tables.';
COMMENT ON TABLE user_stats IS 'User statistics and problem-solving metrics. Automatically created when user signs up.';

COMMENT ON COLUMN users.day_streak IS 'Current daily streak (synced with user_stats.current_streak)';
COMMENT ON COLUMN users.daily_streak IS 'Legacy streak field (kept for backward compatibility, synced with day_streak)';
COMMENT ON COLUMN users.topics_studying IS 'Array of topic tags the user is currently studying';

-- =====================================================
-- FINAL: Mark redundant tables for deletion
-- Note: We don't drop them yet to allow for rollback if needed
-- After verifying everything works, run the cleanup script
-- =====================================================

COMMENT ON TABLE user_profiles IS 'DEPRECATED: Data migrated to users table. Safe to drop after verification.';
COMMENT ON TABLE user_profile IS 'DEPRECATED: Data migrated to users table. Safe to drop after verification.';

COMMIT;

-- =====================================================
-- VERIFICATION QUERIES (Run these after migration)
-- =====================================================

-- Check data migration success
-- SELECT COUNT(*) FROM users WHERE username IS NOT NULL;
-- SELECT COUNT(*) FROM users WHERE day_streak > 0;

-- Verify all users have stats
-- SELECT COUNT(*) FROM users u
-- LEFT JOIN user_stats us ON u.user_id = us.user_id
-- WHERE us.user_id IS NULL;

-- =====================================================
-- ROLLBACK (if needed)
-- =====================================================

-- To rollback this migration:
-- 1. Restore from backups: INSERT INTO user_profiles SELECT * FROM _backup_user_profiles;
-- 2. Restore from backups: INSERT INTO user_profile SELECT * FROM _backup_user_profile;
-- 3. Drop added columns from users table
-- 4. Re-enable RLS on old tables