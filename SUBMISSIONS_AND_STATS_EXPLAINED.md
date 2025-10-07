# Submissions Tracking & Stats System - Complete Explanation

## Overview

Your app now has a fully automated submissions tracking system that updates the contribution grid, calculates acceptance rates, and awards achievements automatically.

---

## How It Works

### **1. Submissions Table → User Stats Flow**

```
User submits code
    ↓
Submission record created in `submissions` table
    ↓
Trigger fires: update_stats_from_submission()
    ↓
Updates `user_stats` table (total_solved, acceptance_rate, etc.)
    ↓
Another trigger fires: check_achievements_on_stats_update()
    ↓
Awards achievements if milestones reached
    ↓
UI updates automatically (grid shows new submission, achievements appear)
```

---

## Database Schema

### **`submissions` Table**

Stores every code submission a user makes:

```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  problem_id INTEGER NOT NULL,
  problem_title TEXT NOT NULL,
  difficulty TEXT NOT NULL,  -- 'Easy', 'Medium', or 'Hard'
  status TEXT NOT NULL,       -- 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', etc.
  language TEXT NOT NULL,     -- 'JavaScript', 'Python', 'Java', etc.
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  runtime_ms INTEGER,
  memory_kb INTEGER
);
```

**Key Points:**
- Every time a user submits code, a new row is inserted
- `status = 'Accepted'` means they solved it correctly
- Same problem can have multiple submissions (multiple attempts)

### **`user_stats` Table**

Aggregated statistics for each user:

```sql
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY,
  total_solved INTEGER DEFAULT 0,        -- Unique problems solved
  easy_solved INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  contest_rating INTEGER DEFAULT 0,
  acceptance_rate NUMERIC DEFAULT 0      -- Percentage of accepted submissions
);
```

**Key Points:**
- `total_solved` counts UNIQUE problems (not total submissions)
- `acceptance_rate` = (Accepted Submissions / Total Submissions) × 100
- Updated automatically via triggers

---

## Acceptance Rate Calculation

### **Formula:**

```
Acceptance Rate = (Number of Accepted Submissions / Total Submissions) × 100
```

### **Example:**

```
User submits code 10 times:
  - 7 submissions: Status = "Accepted"
  - 2 submissions: Status = "Wrong Answer"
  - 1 submission: Status = "Time Limit Exceeded"

Acceptance Rate = (7 / 10) × 100 = 70%
```

### **How It's Calculated (Automatic):**

When a new submission is inserted, the trigger runs this logic:

```sql
-- Count total and accepted submissions
SELECT
  COUNT(*),                                -- Total submissions
  COUNT(*) FILTER (WHERE status = 'Accepted')  -- Accepted only
INTO total_submissions, accepted_submissions
FROM submissions
WHERE user_id = NEW.user_id;

-- Calculate percentage
acceptance_rate = (accepted_submissions / total_submissions) × 100
```

### **Important Notes:**

✅ **Counts ALL submissions** - Including failed attempts
✅ **Higher is better** - 100% means never failed
✅ **Realistic rates** - Most users have 40-80% acceptance rate
✅ **Updates in real-time** - Every submission recalculates it

---

## Total Solved vs Total Submissions

### **Key Difference:**

| Metric | What It Counts | Example |
|--------|----------------|---------|
| **Total Submissions** | Every code submission | User submits "Two Sum" 3 times = 3 submissions |
| **Total Solved** | Unique problems accepted | User submits "Two Sum" 3 times, gets accepted once = 1 solved |

### **Example Scenario:**

```
User tackles 3 problems:

Problem 1 "Two Sum" (Easy):
  - Attempt 1: Wrong Answer
  - Attempt 2: Accepted ✓

Problem 2 "Add Two Numbers" (Medium):
  - Attempt 1: Time Limit Exceeded
  - Attempt 2: Wrong Answer
  - Attempt 3: Accepted ✓

Problem 3 "Merge K Lists" (Hard):
  - Attempt 1: Wrong Answer
  - Attempt 2: Wrong Answer
  - (Not solved yet)

Results:
  Total Submissions: 7
  Total Solved: 2 (only Problems 1 & 2)
  Acceptance Rate: (2 / 7) × 100 = 28.6%
  Easy Solved: 1
  Medium Solved: 1
  Hard Solved: 0
```

### **The Logic (Prevents Double-Counting):**

```sql
-- Only increment total_solved if this is the FIRST accepted submission for this problem
total_solved = CASE
  WHEN NEW.status = 'Accepted' THEN
    CASE
      WHEN NOT EXISTS (
        SELECT 1 FROM submissions s
        WHERE s.user_id = NEW.user_id
          AND s.problem_id = NEW.problem_id
          AND s.status = 'Accepted'
          AND s.id != NEW.id  -- Exclude current submission
      ) THEN total_solved + 1  -- First time solving this problem
      ELSE total_solved        -- Already solved before, don't increment
    END
  ELSE total_solved  -- Not accepted, don't increment
END
```

---

## Recent Submissions

### **What It Shows:**

The "Recent Submissions" section displays the last 5 submissions ordered by date.

### **Query:**

```typescript
const { data: submissions } = await supabase
  .from('submissions')
  .select('*')
  .eq('user_id', user.id)
  .order('submitted_at', { ascending: false })
  .limit(5);
```

### **What You See:**

Each submission shows:
- **Problem Title** - "Two Sum"
- **Difficulty Badge** - Easy/Medium/Hard (colored)
- **Language** - JavaScript, Python, etc.
- **Date** - When it was submitted
- **Status Badge** - Accepted (green) or Failed (red)

---

## Contribution Grid (GitHub-Style)

### **How It Works:**

The grid shows submission activity over the past 365 days.

### **Visual Intensity Levels:**

| Level | Color | Submissions |
|-------|-------|-------------|
| 0 | Gray (dim) | 0 submissions |
| 1 | Light green | 1 submission |
| 2 | Medium green | 2 submissions |
| 3 | Bright green | 3 submissions |
| 4 | Vivid green | 4+ submissions |

### **Data Generation:**

```typescript
// Create a map of dates to submission counts
const submissionsByDate = new Map<string, number>();
submissions.forEach(sub => {
  const date = new Date(sub.submitted_at).toISOString().split('T')[0];
  submissionsByDate.set(date, (submissionsByDate.get(date) || 0) + 1);
});

// For each day in the past 365 days
const count = submissionsByDate.get(dateStr) || 0;
const level = count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : count <= 3 ? 3 : 4;
```

### **New Features (Just Added):**

✅ **Month Labels** - Shows "Jan", "Feb", "Mar", etc. at the top
✅ **Day Labels** - Shows "Mon", "Wed", "Fri" on the left
✅ **Enhanced Tooltips** - Hover shows full date and submission count
✅ **Better Visual Separation** - Clearer grid with borders on hover

---

## Testing the System

### **Step 1: Run the Migrations**

```sql
-- Run in Supabase SQL Editor:
-- 1. First, run the achievements migration
-- 2. Then, run the submissions tracking migration
```

### **Step 2: Create Test Submissions**

Instead of manually updating `user_stats`, create actual submissions:

```sql
-- Single submission
SELECT create_test_submission(
  'your-user-uuid',
  1,                    -- problem_id
  'Two Sum',            -- problem_title
  'Easy',               -- difficulty
  'Accepted',           -- status
  'JavaScript',         -- language
  NOW()                 -- submitted_at
);

-- Generate realistic submission history (30 days, ~3 per day = 90 submissions)
SELECT generate_submission_history('your-user-uuid', 30, 3);
```

### **Step 3: Verify the Grid Updates**

1. Visit `http://localhost:3000/profile`
2. You should see the contribution grid filled with green squares
3. Hover over squares to see submission counts
4. Check "Recent Submissions" section shows your submissions
5. Verify acceptance rate is calculated correctly

### **Step 4: Test Achievements**

```sql
-- Create 5 accepted submissions (should award "Getting Started" achievement)
SELECT create_test_submission('your-user-uuid', generate_series(1,5), 'Problem ' || generate_series(1,5), 'Easy', 'Accepted', 'JavaScript');

-- Check achievements
SELECT name, earned_at
FROM user_achievements_with_details
WHERE user_id = 'your-user-uuid'
ORDER BY earned_at DESC;
```

---

## Common Scenarios

### **Scenario 1: User Solves a Problem on First Try**

```sql
INSERT INTO submissions (user_id, problem_id, problem_title, difficulty, status, language)
VALUES ('user-123', 1, 'Two Sum', 'Easy', 'Accepted', 'JavaScript');

-- Result:
-- ✅ total_solved += 1
-- ✅ easy_solved += 1
-- ✅ acceptance_rate = 100% (1 accepted / 1 total)
-- ✅ Grid shows 1 submission today
-- ✅ May award "First Steps" achievement
```

### **Scenario 2: User Fails Then Succeeds**

```sql
-- Attempt 1: Failed
INSERT INTO submissions (user_id, problem_id, problem_title, difficulty, status, language)
VALUES ('user-123', 2, 'Add Two Numbers', 'Medium', 'Wrong Answer', 'Python');

-- Attempt 2: Success
INSERT INTO submissions (user_id, problem_id, problem_title, difficulty, status, language)
VALUES ('user-123', 2, 'Add Two Numbers', 'Medium', 'Accepted', 'Python');

-- Result:
-- ✅ total_solved += 1 (only counted once, despite 2 submissions)
-- ✅ medium_solved += 1
-- ✅ acceptance_rate = 50% (1 accepted / 2 total)
-- ✅ Grid shows 2 submissions today
```

### **Scenario 3: User Re-Solves Same Problem**

```sql
-- Already solved problem 1 yesterday
-- Today, user submits it again
INSERT INTO submissions (user_id, problem_id, problem_title, difficulty, status, language)
VALUES ('user-123', 1, 'Two Sum', 'Easy', 'Accepted', 'JavaScript');

-- Result:
-- ❌ total_solved stays the same (already solved before)
-- ❌ easy_solved stays the same
-- ✅ acceptance_rate recalculated with new submission
-- ✅ Grid shows +1 submission today
```

---

## Cleaning Up Test Data

### **Remove All Test Submissions:**

```sql
-- Delete all submissions from today
DELETE FROM submissions
WHERE user_id = 'your-user-uuid'
  AND submitted_at >= CURRENT_DATE;

-- Recalculate stats (run backfill)
DELETE FROM user_achievements WHERE user_id = 'your-user-uuid';
UPDATE user_stats SET total_solved = 0, easy_solved = 0, medium_solved = 0, hard_solved = 0, acceptance_rate = 0 WHERE user_id = 'your-user-uuid';
SELECT backfill_achievements_for_user('your-user-uuid');
```

---

## Summary

### **✅ What's Automated:**

1. **Submission tracking** - Every code submission is recorded
2. **Stats updates** - `user_stats` updates automatically from submissions
3. **Acceptance rate** - Calculated on every new submission
4. **Achievement awards** - Granted when stats reach milestones
5. **Grid updates** - Contribution grid reflects submission history
6. **Unique problem counting** - Prevents double-counting solved problems

### **✅ What You Need to Do:**

1. Run the two migration files
2. When a user submits code in your app, insert a record into `submissions` table
3. Everything else happens automatically!

### **✅ Key Files:**

- Migration: `20250107_submissions_tracking_fix.sql`
- Profile Page: `app/profile/page.tsx` (enhanced grid)
- API: `app/api/profile/route.ts` (fetches submissions)

---

**Created:** January 7, 2025
**Status:** ✅ Ready to test and deploy
