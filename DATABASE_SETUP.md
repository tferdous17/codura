# Database Setup Instructions

## Setting up Supabase Database Tables

You need to run the SQL migration to create the necessary database tables for user profiles, stats, submissions, and achievements.

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard at https://supabase.com/dashboard
2. Navigate to the **SQL Editor** section in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase/migrations/001_create_user_profiles.sql`
5. Paste into the SQL editor
6. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
supabase db push
```

### Verification

After running the migration, verify the tables were created:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the following tables:
   - `user_profiles`
   - `user_stats`
   - `submissions`
   - `achievements`
   - `user_achievements`

## Creating Your First Profile

After setting up the database:

1. Sign in to your application
2. Navigate to `/profile`
3. Click the **Edit Profile** button
4. Fill in your profile information
5. Click **Save Changes**

Your profile data is now stored in Supabase and will persist across sessions!

## Troubleshooting

### Error: "Unauthorized" when loading profile

- Make sure you're signed in
- Check that RLS policies are enabled correctly

### Error: "Failed to fetch profile data"

- Verify the database tables were created
- Check your Supabase URL and API key in `.env`
- Check browser console for more details

### Profile not updating

- Check browser console for errors
- Verify the API route is working: `/api/profile`
- Ensure RLS policies allow updates for authenticated users
