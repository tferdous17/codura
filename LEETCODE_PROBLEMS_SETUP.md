# 🚀 LeetCode Problems Integration - Complete Guide

## Overview

Your problems page now uses **real LeetCode data** via their GraphQL API! No hardcoded problems - everything is fetched dynamically and stored in your Supabase database.

## How It Works

### 1. **LeetCode GraphQL API**
We use LeetCode's unofficial GraphQL API at `https://leetcode.com/graphql` to fetch:
- All 3000+ problems
- Problem details (title, difficulty, tags, acceptance rate)
- Topic tags
- Premium/free status
- Solution availability

### 2. **Database Storage**
Problems are stored in Supabase with:
- Full problem metadata
- Topic tags (searchable)
- User progress tracking
- Curated lists (NeetCode 150, Blind 75, etc.)

### 3. **Smart Caching**
- Problems are fetched once and stored in database
- Frontend queries from your database (fast!)
- Can refresh/update problems periodically

## 📦 What Was Created

### Database Schema
**File**: `supabase/migrations/002_create_problems_table.sql`

Tables created:
- `problems` - All LeetCode problems
- `user_problem_progress` - Tracks which problems users solved
- `problem_lists` - Curated lists (NeetCode 150, Blind 75)
- `problem_list_items` - Junction table for lists

### LeetCode Fetcher
**File**: `lib/leetcode-fetcher.ts`

Functions:
- `fetchAllProblems()` - Fetch problems from LeetCode API
- `fetchProblemDetail()` - Get detailed info for one problem
- `fetchProblemsInBatches()` - Smart batch fetching
- `transformProblemForDB()` - Convert to database format

### Population Script
**File**: `scripts/populate-problems.ts`

Automated script to:
1. Fetch all problems from LeetCode
2. Transform data
3. Insert into Supabase
4. Show progress and stats

### API Routes
**Files**: `app/api/problems/**`

Endpoints:
- `GET /api/problems` - List problems with filters
- `GET /api/problems/[slug]` - Get single problem
- `GET /api/problems/stats` - Get statistics

### Problems Page
**File**: `app/problems/page.tsx`

Features:
- 📊 Statistics cards (total, by difficulty)
- 🔍 Search by title
- 🎯 Filter by difficulty (Easy/Medium/Hard)
- 🏷️ Display topic tags
- 📄 Pagination
- 🔒 Premium badge indicator
- ✅ Acceptance rate display

## 🎯 Step-by-Step Setup

### Step 1: Run Database Migration

Go to your Supabase dashboard:
1. https://supabase.com/dashboard
2. SQL Editor → New Query
3. Copy contents of `supabase/migrations/002_create_problems_table.sql`
4. Paste and click **Run**

You should see: "Success. No rows returned"

### Step 2: Verify Tables Created

In Supabase dashboard:
- Table Editor → Check these tables exist:
  - ✅ problems
  - ✅ user_problem_progress
  - ✅ problem_lists
  - ✅ problem_list_items

### Step 3: Populate Problems from LeetCode

Run the population script:

```bash
npx tsx scripts/populate-problems.ts
```

This will:
- ✅ Fetch all 3000+ problems from LeetCode
- ✅ Transform data for database
- ✅ Insert in batches (with progress)
- ✅ Show statistics

**Expected output:**
```
🚀 Starting LeetCode problems import...

📥 Fetching problems from LeetCode GraphQL API...
   Fetching problems 1 to 100...
   Fetching problems 101 to 200...
   ...
✅ Fetched 3000 problems

💾 Inserting problems into database...
   Processing batch 1/30...
   ✅ Processed 100 problems
   ...

📊 Import Summary:
   Total problems fetched: 3000
   Successfully inserted/updated: 3000
   Errors: 0

🔍 Verifying database...
   ✅ Database now contains 3000 problems

📈 Breakdown by difficulty:
   🟢 Easy: 800
   🟡 Medium: 1600
   🔴 Hard: 600

✨ Import completed successfully!
```

**Time estimate**: 5-10 minutes (depends on API rate limits)

### Step 4: Test the Problems Page

Visit: http://localhost:3001/problems

You should see:
- ✅ Statistics showing total problems
- ✅ Filters (Easy/Medium/Hard)
- ✅ Search bar
- ✅ List of 50 problems per page
- ✅ Pagination at bottom

## 🎨 Features Implemented

### Statistics Dashboard
```typescript
📊 Total Problems: 3000
🟢 Easy: 800
🟡 Medium: 1600
🔴 Hard: 600
```

### Search & Filter
- Search by problem title
- Filter by difficulty
- Filter by tags (coming soon)
- Show/hide premium problems

### Problem Display
Each problem shows:
- Problem number (#123)
- Title
- Difficulty badge (color-coded)
- Topic tags (first 2)
- Acceptance rate
- Premium lock icon (if applicable)

### Pagination
- 50 problems per page
- Page navigation
- Maintains filters across pages

## 🔄 Updating Problems

To refresh problems from LeetCode:

```bash
npx tsx scripts/populate-problems.ts
```

The script uses **upsert**, so:
- New problems will be added
- Existing problems will be updated
- No duplicates

## 📝 API Usage Examples

### Get All Problems
```typescript
fetch('/api/problems?page=1&limit=50')
```

### Filter by Difficulty
```typescript
fetch('/api/problems?difficulty=Medium&page=1')
```

### Search Problems
```typescript
fetch('/api/problems?search=two sum&page=1')
```

### Get Problem Details
```typescript
fetch('/api/problems/two-sum')
```

### Get Statistics
```typescript
fetch('/api/problems/stats')
```

## 🛡️ Security & Performance

### Row Level Security (RLS)
```sql
-- Anyone can view problems (public)
CREATE POLICY "Anyone can view problems" ON problems
  FOR SELECT USING (true);

-- Only users can track their own progress
CREATE POLICY "Users can view own progress" ON user_problem_progress
  FOR SELECT USING (auth.uid() = user_id);
```

### Indexes for Performance
```sql
-- Fast filtering by difficulty
CREATE INDEX idx_problems_difficulty ON problems(difficulty);

-- Fast search by title slug
CREATE INDEX idx_problems_title_slug ON problems(title_slug);

-- Fast tag searches (JSONB index)
CREATE INDEX idx_problems_topic_tags ON problems USING GIN (topic_tags);
```

## 🎯 Next Steps

### 1. Individual Problem Page (Coming Soon)
Create `/problems/[slug]/page.tsx` to show:
- Full problem description
- Code editor
- Test cases
- Submit solution
- Discussion/hints

### 2. Problem Lists Integration
Implement curated lists:
- NeetCode 150
- Blind 75
- Grind 75
- Custom user lists

### 3. User Progress Tracking
Track which problems users:
- ✅ Solved
- 🟡 Attempted
- ⭕ Todo

### 4. Submissions System
Full code submission system:
- Run code against test cases
- Track submission history
- Update stats automatically
- Calculate streaks

## 🐛 Troubleshooting

### "No problems found"
**Solution**: Run the population script
```bash
npx tsx scripts/populate-problems.ts
```

### "Error fetching problems"
**Check**:
1. Database migration ran successfully
2. Supabase credentials in `.env` are correct
3. RLS policies are enabled

### Script fails with "HTTP error 429"
**Solution**: LeetCode rate limiting
- Wait a few minutes
- Script will retry automatically
- Decrease batch size in script (change 100 to 50)

### Missing images or descriptions
**Solution**: Run detail fetcher (advanced)
```bash
# Coming soon: fetch detailed descriptions
npx tsx scripts/fetch-problem-details.ts
```

## 📊 Database Structure

### problems Table
```sql
id                 SERIAL PRIMARY KEY
leetcode_id        INTEGER (LeetCode's problem number)
title              TEXT (e.g., "Two Sum")
title_slug         TEXT (e.g., "two-sum")
difficulty         TEXT (Easy/Medium/Hard)
acceptance_rate    DECIMAL (e.g., 49.3)
topic_tags         JSONB (["Array", "Hash Table"])
is_premium         BOOLEAN
has_solution       BOOLEAN
has_video_solution BOOLEAN
description        TEXT (full HTML description)
code_snippets      JSONB (starter code for each language)
hints              JSONB (array of hints)
```

### user_problem_progress Table
```sql
user_id            UUID (references auth.users)
problem_id         INTEGER (references problems)
status             TEXT (Solved/Attempted/Todo)
last_submission_id UUID (references submissions)
last_attempted_at  TIMESTAMP
```

## 🎉 Summary

You now have:
- ✅ 3000+ real LeetCode problems
- ✅ No hardcoded data
- ✅ Fast, searchable database
- ✅ Beautiful problems page
- ✅ Filters and pagination
- ✅ Ready for submissions system

**Your problems page works just like LeetCode and NeetCode!** 🚀

## 💡 How NeetCode Did It

NeetCode uses a similar approach:
1. Fetches problems from LeetCode's API
2. Stores in their database
3. Curates specific lists (NeetCode 150)
4. Adds video solutions as extras

You're now doing the exact same thing! The only difference is they manually curate which 150 problems to focus on - you can do that next with the `problem_lists` table.
