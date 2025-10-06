# 🚀 Quick Start - Problems Page

## ✅ The script is currently running!

Your populate script is now fetching **3706 problems** from LeetCode's API. This will take about 5-10 minutes.

## What's Happening Right Now:

```
📥 Fetching problems from LeetCode GraphQL API...
   Fetching problems 1 to 100... ✓
   Fetching problems 101 to 200... ✓
   Fetching problems 201 to 300... ✓
   ... (continuing)
```

## What You Need to Do:

### ⚠️ IMPORTANT: Run Database Migration First

**Before the script finishes**, you MUST run the database migration in Supabase:

1. Go to https://supabase.com/dashboard
2. Click on your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/002_create_problems_table.sql`
6. Paste into the editor
7. Click **Run** (bottom right corner)

You should see: **"Success. No rows returned"**

### ✅ Verify Tables Were Created

After running the migration:

1. Click **Table Editor** in the left sidebar
2. You should see these NEW tables:
   - ✅ `problems`
   - ✅ `user_problem_progress`
   - ✅ `problem_lists`
   - ✅ `problem_list_items`

### 📊 Wait for Script to Complete

The script will:
1. Fetch all 3706 problems (5-10 minutes)
2. Insert them into your database in batches
3. Show you statistics when done

Expected final output:
```
📊 Import Summary:
   Total problems fetched: 3706
   Successfully inserted/updated: 3706
   Errors: 0

📈 Breakdown by difficulty:
   🟢 Easy: ~800
   🟡 Medium: ~1600
   🔴 Hard: ~600

✨ Import completed successfully!
```

## After Setup is Complete:

Visit: **http://localhost:3001/problems**

You should see:
- ✅ Statistics showing total problems
- ✅ Search bar working
- ✅ Difficulty filters (Easy/Medium/Hard)
- ✅ List of 50 problems per page
- ✅ Pagination controls

## Troubleshooting:

### Script shows "Missing Supabase credentials"
**Fixed!** We added `import 'dotenv/config'` to load your .env file.

### Script fails with "relation 'problems' does not exist"
**Solution**: Run the database migration first (see step above)

### Script is taking too long
**Normal!** Fetching 3706 problems takes 5-10 minutes due to API rate limits.

### Want to stop the script?
Press `Ctrl + C` in the terminal. You can restart it anytime with:
```bash
npx tsx scripts/populate-problems.ts
```

## What You Got:

✅ **Real LeetCode Problems** - No hardcoded data
✅ **Full Metadata** - Title, difficulty, tags, acceptance rate
✅ **Searchable** - Fast database queries
✅ **Filterable** - By difficulty, tags, premium status
✅ **Pagination** - 50 problems per page
✅ **User Progress Tracking** - Tables ready for submissions

## Next Time You Need to Update:

Just run the script again:
```bash
npx tsx scripts/populate-problems.ts
```

It will update existing problems and add any new ones!

---

**Let the script finish running, then check out your problems page!** 🎉
