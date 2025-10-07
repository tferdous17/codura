# Database Migration Guide - User Tables Consolidation

## Overview
This migration consolidates three redundant user tables (`users`, `user_profiles`, `user_profile`) into a single unified `users` table, eliminating data inconsistencies and fixing the "Failed to load user data" error.

## Problem Statement
- **Issue**: Multiple user tables with overlapping data causing sync issues
- **Error**: Dashboard shows "Failed to load user data" after questionnaire completion
- **Root Cause**: Data scattered across `users`, `user_profiles`, and `user_profile` tables without proper synchronization

## Solution
1. Merge all user data into single `users` table
2. Keep `user_stats` separate for performance
3. Add triggers for automatic synchronization
4. Update all application code to use unified schema

---

## Migration Steps

### Step 1: Backup Your Database (CRITICAL!)
```bash
# In Supabase Dashboard:
# Settings > Database > Create backup
# OR use pg_dump if you have direct access
```

### Step 2: Run Main Consolidation Migration

**Location**: `supabase/migrations/20250101_consolidate_user_tables.sql`

**In Supabase Dashboard**:
1. Go to SQL Editor
2. Open the migration file
3. Review the SQL carefully
4. Click "Run"

**What it does**:
- ✅ Backs up existing tables (`_backup_user_profiles`, `_backup_user_profile`)
- ✅ Adds new columns to `users` table
- ✅ Migrates data from `user_profiles` and `user_profile`
- ✅ Ensures all users have `user_stats` entries
- ✅ Creates triggers for auto-synchronization
- ✅ Updates RLS policies
- ✅ Creates indexes for performance
- ⚠️ Marks old tables as deprecated (doesn't drop them yet)

### Step 3: Verify Migration Success

Run these queries in SQL Editor:

```sql
-- Check data migration
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as users_with_username FROM users WHERE username IS NOT NULL;
SELECT COUNT(*) as users_with_streak FROM users WHERE day_streak > 0;

-- Verify all users have stats
SELECT COUNT(*) as missing_stats
FROM users u
LEFT JOIN user_stats us ON u.user_id = us.user_id
WHERE us.user_id IS NULL;
-- Should return 0

-- Check trigger is working
SELECT tgname, tgtype FROM pg_trigger WHERE tgname LIKE '%user%';
```

### Step 4: Deploy Application Code

The following files have been updated to use the unified schema:

**Updated Files**:
- ✅ `app/auth/callback/route.ts` - User creation on signup
- ✅ `app/api/profile/route.ts` - Profile GET/PUT endpoints
- ✅ `app/login/actions.ts` - Login and signup actions
- ✅ `app/dashboard/page.tsx` - Dashboard data fetching (no changes needed)

**Deployment**:
```bash
# Commit changes
git add .
git commit -m "feat: consolidate user tables and fix data sync issues"

# Push to your deployment
git push origin main

# Or deploy directly
npm run deploy
# or
vercel deploy --prod
```

### Step 5: Test the Complete Flow

1. **Test New User Signup**:
   - Sign up with a new account
   - Verify redirect to onboarding
   - Check user appears in `users` table
   - Check `user_stats` was auto-created

2. **Test Onboarding**:
   - Complete school code entry
   - Verify redirect to questionnaire
   - Check `federal_school_code` saved in `users`

3. **Test Questionnaire**:
   - Complete questionnaire
   - Verify redirect to dashboard
   - Check `questionnaire_completed = true` in `users`

4. **Test Dashboard**:
   - Verify no "Failed to load user data" error
   - Check stats display correctly
   - Verify streak shows properly

5. **Test Profile Edit**:
   - Update profile information
   - Verify changes saved to `users` table
   - Check `updated_at` timestamp updates

### Step 6: Final Cleanup (After 1-2 Weeks)

Once you're confident everything works:

**Location**: `supabase/migrations/20250102_final_cleanup.sql`

```bash
# This will:
# - Drop deprecated tables (user_profiles, user_profile)
# - Keep backup tables (_backup_user_profiles, _backup_user_profile)
# - Clean up any remaining unused columns
```

---

## Rollback Plan

If something goes wrong:

### Immediate Rollback (Before Cleanup):

```sql
BEGIN;

-- Restore from backups
INSERT INTO user_profiles SELECT * FROM _backup_user_profiles
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_profile SELECT * FROM _backup_user_profile
ON CONFLICT (user_id) DO NOTHING;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

COMMIT;
```

### Code Rollback:
```bash
git revert <commit-hash>
git push origin main
```

---

## Database Schema - Before vs After

### BEFORE (Redundant):
```
┌─────────────────┐
│     users       │  ← Onboarding data
│  - full_name    │
│  - email        │
│  - federal_code │
│  - quest_done   │
│  - daily_streak │
└─────────────────┘

┌─────────────────┐
│ user_profiles   │  ← Profile data
│  - id           │
│  - full_name    │  ← DUPLICATE
│  - username     │
│  - bio          │
│  - university   │
└─────────────────┘

┌─────────────────┐
│  user_profile   │  ← Dashboard data
│  - user_id      │
│  - full_name    │  ← DUPLICATE
│  - day_streak   │  ← DUPLICATE
│  - problems     │
└─────────────────┘
```

### AFTER (Unified):
```
┌─────────────────────────┐
│         users           │  ← ALL user data
│  - user_id (PK)         │
│  - full_name            │
│  - email                │
│  - username             │
│  - bio                  │
│  - avatar_url           │
│  - university           │
│  - graduation_year      │
│  - federal_school_code  │
│  - questionnaire_done   │
│  - day_streak           │
│  - daily_streak (sync)  │
│  - topics_studying      │
│  - created_at           │
│  - updated_at           │
└─────────────────────────┘
          │
          │ (1:1, auto-created by trigger)
          ↓
┌─────────────────────────┐
│      user_stats         │  ← Statistics only
│  - user_id (PK, FK)     │
│  - total_solved         │
│  - easy_solved          │
│  - medium_solved        │
│  - hard_solved          │
│  - current_streak       │  ← synced with users.day_streak
│  - longest_streak       │
│  - total_points         │
│  - acceptance_rate      │
│  - created_at           │
│  - updated_at           │
└─────────────────────────┘
```

---

## Triggers Created

### 1. `trigger_create_user_stats`
- **When**: AFTER INSERT on `users`
- **Does**: Automatically creates `user_stats` entry for new users

### 2. `trigger_sync_user_streak`
- **When**: BEFORE UPDATE on `users`
- **Does**: Keeps `day_streak` and `daily_streak` in sync

### 3. `trigger_sync_user_stats`
- **When**: AFTER UPDATE on `user_stats`
- **Does**: Updates `users.day_streak` when `user_stats.current_streak` changes

---

## Benefits

✅ **Single Source of Truth**: All user data in one place
✅ **No More Sync Issues**: Triggers handle synchronization automatically
✅ **Better Performance**: Fewer table joins, indexed columns
✅ **Easier Maintenance**: One table to update instead of three
✅ **Fixed Dashboard Error**: Proper data loading guaranteed
✅ **Backward Compatible**: Old `daily_streak` column synced with new `day_streak`

---

## Monitoring

After deployment, monitor these metrics:

### Database Queries to Run Daily:

```sql
-- Check for users without stats (should be 0)
SELECT COUNT(*) FROM users u
LEFT JOIN user_stats us ON u.user_id = us.user_id
WHERE us.user_id IS NULL;

-- Check for data inconsistencies
SELECT COUNT(*) FROM users
WHERE day_streak != daily_streak;
-- Should be 0 after trigger runs

-- Monitor trigger performance
SELECT schemaname, tablename, n_tup_ins, n_tup_upd
FROM pg_stat_user_tables
WHERE tablename IN ('users', 'user_stats');
```

### Application Logs to Monitor:

- Watch for "Failed to load user data" errors (should be 0)
- Monitor signup success rate
- Check questionnaire completion rate
- Verify dashboard load times

---

## Support

If you encounter issues:

1. Check Supabase logs: Dashboard > Logs
2. Check application logs: `npm run dev` or deployment logs
3. Verify RLS policies: Settings > Database > Policies
4. Test with a fresh user account
5. Review backup tables if data looks wrong

---

## Cleanup Timeline

| Time | Action |
|------|--------|
| Day 0 | Run main migration |
| Day 1 | Deploy application code |
| Day 1-3 | Monitor for issues |
| Day 7 | Verify everything working |
| Day 14+ | Run final cleanup (drop old tables) |

---

## Questions?

- Migration file: `supabase/migrations/20250101_consolidate_user_tables.sql`
- Cleanup file: `supabase/migrations/20250102_final_cleanup.sql`
- Updated code: See git commit history

**Remember**: Test on a development database first if possible!
