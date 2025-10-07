# Database Migration Instructions

## New Features Added

This update adds two major features to Codura:

### 1. **Calendar Events**
- Create and manage calendar events (solve problems, mock interviews, study pods, live streams)
- View events by month with dynamic calendar
- Click empty days to create new events
- Click days with events to view event details

### 2. **Study Plans (Problem Lists)**
- Create custom study plans/problem lists
- Add problems to lists from the problems page
- Default "Saved Problems" list created automatically for new users
- Quick save functionality (like Spotify's "Liked Songs")
- Create new lists and organize problems

## How to Apply Migrations

You have **3 migration files** to run in order:

1. `supabase/migrations/003_create_calendar_events.sql`
2. `supabase/migrations/004_update_study_plans.sql`

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste each migration file's content in order
4. Run each migration

### Option 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push

# Or run migrations individually
supabase db execute --file supabase/migrations/003_create_calendar_events.sql
supabase db execute --file supabase/migrations/004_update_study_plans.sql
```

### Option 3: Manual SQL Execution

Connect to your Supabase database and execute the SQL from each file in order.

## What the Migrations Do

### Migration 003 - Calendar Events
- Creates `calendar_events` table for storing user calendar events
- Adds indexes for efficient querying
- Sets up Row Level Security (RLS) policies
- Creates a helper function `get_calendar_events_for_month()`

### Migration 004 - Study Plans
- Creates `user_problem_lists` table for custom user lists
- Creates `user_list_problems` junction table
- Updates RLS policies for list management
- Adds trigger to auto-create "Saved Problems" list for new users
- Creates helper function `get_user_problem_lists()`

## After Migration

Once migrations are complete:

1. **Calendar will work dynamically:**
   - Switch between months
   - Create events by clicking on days
   - View existing events

2. **Study Plans will work:**
   - Create custom lists from dashboard
   - Add problems to lists from problems page
   - Quick save to default "Saved Problems" list
   - Create new lists on the fly

## Testing

1. Navigate to `/dashboard` - Calendar should load current month
2. Click on any empty day - Event creation dialog should appear
3. Create an event and verify it appears on the calendar
4. Navigate to `/problems` - Hover over problems to see "Add to List" button
5. Click "Add to List" - Dialog should show your lists
6. Quick save should add to "Saved Problems" list

## Important Notes

- The "Saved Problems" list is created automatically for new users via a database trigger
- Existing users will need to create a list manually or you can run a script to create it for them
- All calendar events are user-specific (RLS enforced)
- All lists and problems are user-specific (RLS enforced)