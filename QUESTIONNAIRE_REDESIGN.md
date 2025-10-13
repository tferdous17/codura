# Smart Questionnaire Redesign

## Strategic Questions (Post-Onboarding)

### Question 1: What are your primary coding goals? 
**Type:** Multiple choice (select up to 3)
**Purpose:** Understand motivation, recommend problem patterns, personalize dashboard
**DB Fields:** Can inform `topics_studying`, problem difficulty recommendations

**Options:**
- Land a FAANG/Big Tech job
- Pass technical interviews
- Improve problem-solving skills
- Learn new algorithms & data structures
- Prepare for coding competitions
- Build stronger CS foundations
- Career transition to tech
- Academic/school requirements
- Personal growth & learning

---

### Question 2: What's your experience level with coding problems?
**Type:** Single choice
**Purpose:** Calibrate difficulty, recommend starting point, track growth
**DB Fields:** Informs initial problem recommendations

**Options:**
- Complete beginner (never solved algorithmic problems)
- Beginner (solved 1-50 problems)
- Intermediate (solved 50-200 problems)
- Advanced (solved 200-500 problems)
- Expert (solved 500+ problems)

---

### Question 3: Which topics would you like to focus on?
**Type:** Multiple choice (select up to 5)
**Purpose:** Direct problem recommendations, create personalized study plans
**DB Fields:** Directly maps to `topics_studying` array

**Options:**
- Arrays & Strings
- Hash Tables & Sets
- Two Pointers
- Sliding Window
- Binary Search
- Linked Lists
- Stacks & Queues
- Binary Trees
- Graph Algorithms
- Dynamic Programming
- Backtracking & Recursion
- Greedy Algorithms
- Bit Manipulation
- Math & Geometry
- System Design Basics

---

### Question 4: What best describes your current situation?
**Type:** Single choice
**Purpose:** Enable networking, understand user context, match with similar users
**DB Fields:** Maps to `job_title` or custom field, helps with school connections

**Options:**
- High school student
- Undergraduate student (Year 1-2)
- Undergraduate student (Year 3-4)
- Graduate student (Master's/PhD)
- Recent graduate (0-2 years out)
- Software Engineer (0-2 years exp)
- Software Engineer (3-5 years exp)
- Software Engineer (5+ years exp)
- Career switcher/Bootcamp grad
- Actively job searching
- Taking a break/Upskilling
- Other

---

## Benefits of This Design

### 1. **Problem Recommendations**
- Q1 + Q2 → Difficulty calibration
- Q3 → Topic-based filtering
- Creates personalized "Recommended for You" section

### 2. **Networking Features**
- School (from onboarding) + Q4 → Connect users from same school
- Major + Q4 → Professional networking
- Graduation year (optional add) → Alumni connections

### 3. **Smart Features We Can Build**
- **Daily Challenge:** Based on Q3 topics
- **Study Plans:** Auto-generate from Q1 + Q3
- **Difficulty Progression:** Q2 → Easy → Medium → Hard path
- **User Matching:** Connect study buddies with similar goals (Q1)
- **School Leaderboards:** Filter by Q4 status

### 4. **Data-Driven Insights**
- Track which goals correlate with success
- Identify common topic struggles
- Optimize problem recommendations over time

---

## Database Updates Needed

### Add to `users` table:
```sql
-- Already exists
topics_studying text[] DEFAULT '{}'

-- Recommended additions:
experience_level text, -- 'beginner', 'intermediate', 'advanced', 'expert'
primary_goals text[], -- Array of selected goals
current_situation text, -- From Q4
graduation_year integer, -- Optional, can ask during onboarding
```

### Update `user_answers` table:
- Already structured correctly for this

---

## Implementation Plan

1. ✅ Update database questions table with new questions
2. ✅ Update question_options table with new options
3. ✅ Modify questionnaire modal to use new questions
4. ✅ Update API to process answers into user profile fields
5. ✅ Create problem recommendation algorithm based on answers
6. ✅ Build "Recommended for You" section on dashboard

---

## Migration SQL (To be executed)

```sql
-- Clear existing questions and start fresh
DELETE FROM user_answers;
DELETE FROM question_options;
DELETE FROM questions;

-- Insert new strategic questions
INSERT INTO questions (prompt, type, allows_multiple, position, is_active) VALUES
('What are your primary coding goals?', 'multiple_choice', true, 1, true),
('What''s your experience level with coding problems?', 'single_choice', false, 2, true),
('Which topics would you like to focus on?', 'multiple_choice', true, 3, true),
('What best describes your current situation?', 'single_choice', false, 4, true);

-- Get question IDs
DO $$
DECLARE
    q1_id bigint;
    q2_id bigint;
    q3_id bigint;
    q4_id bigint;
BEGIN
    SELECT question_id INTO q1_id FROM questions WHERE position = 1;
    SELECT question_id INTO q2_id FROM questions WHERE position = 2;
    SELECT question_id INTO q3_id FROM questions WHERE position = 3;
    SELECT question_id INTO q4_id FROM questions WHERE position = 4;

    -- Q1 Options
    INSERT INTO question_options (question_id, label, value, position) VALUES
    (q1_id, 'Land a FAANG/Big Tech job', 'faang', 1),
    (q1_id, 'Pass technical interviews', 'interviews', 2),
    (q1_id, 'Improve problem-solving skills', 'problem_solving', 3),
    (q1_id, 'Learn algorithms & data structures', 'algorithms', 4),
    (q1_id, 'Prepare for coding competitions', 'competitions', 5),
    (q1_id, 'Build stronger CS foundations', 'foundations', 6),
    (q1_id, 'Career transition to tech', 'career_switch', 7),
    (q1_id, 'Academic/school requirements', 'academic', 8),
    (q1_id, 'Personal growth & learning', 'personal', 9);

    -- Q2 Options
    INSERT INTO question_options (question_id, label, value, position) VALUES
    (q2_id, 'Complete beginner (never solved algorithmic problems)', 'complete_beginner', 1),
    (q2_id, 'Beginner (solved 1-50 problems)', 'beginner', 2),
    (q2_id, 'Intermediate (solved 50-200 problems)', 'intermediate', 3),
    (q2_id, 'Advanced (solved 200-500 problems)', 'advanced', 4),
    (q2_id, 'Expert (solved 500+ problems)', 'expert', 5);

    -- Q3 Options
    INSERT INTO question_options (question_id, label, value, position) VALUES
    (q3_id, 'Arrays & Strings', 'arrays_strings', 1),
    (q3_id, 'Hash Tables & Sets', 'hash_tables', 2),
    (q3_id, 'Two Pointers', 'two_pointers', 3),
    (q3_id, 'Sliding Window', 'sliding_window', 4),
    (q3_id, 'Binary Search', 'binary_search', 5),
    (q3_id, 'Linked Lists', 'linked_lists', 6),
    (q3_id, 'Stacks & Queues', 'stacks_queues', 7),
    (q3_id, 'Binary Trees', 'binary_trees', 8),
    (q3_id, 'Graph Algorithms', 'graphs', 9),
    (q3_id, 'Dynamic Programming', 'dynamic_programming', 10),
    (q3_id, 'Backtracking & Recursion', 'backtracking', 11),
    (q3_id, 'Greedy Algorithms', 'greedy', 12),
    (q3_id, 'Bit Manipulation', 'bit_manipulation', 13),
    (q3_id, 'Math & Geometry', 'math', 14),
    (q3_id, 'System Design Basics', 'system_design', 15);

    -- Q4 Options
    INSERT INTO question_options (question_id, label, value, position) VALUES
    (q4_id, 'High school student', 'high_school', 1),
    (q4_id, 'Undergraduate (Year 1-2)', 'undergrad_early', 2),
    (q4_id, 'Undergraduate (Year 3-4)', 'undergrad_late', 3),
    (q4_id, 'Graduate student (Master''s/PhD)', 'graduate', 4),
    (q4_id, 'Recent graduate (0-2 years)', 'recent_grad', 5),
    (q4_id, 'Software Engineer (0-2 years)', 'swe_junior', 6),
    (q4_id, 'Software Engineer (3-5 years)', 'swe_mid', 7),
    (q4_id, 'Software Engineer (5+ years)', 'swe_senior', 8),
    (q4_id, 'Career switcher/Bootcamp grad', 'career_switcher', 9),
    (q4_id, 'Actively job searching', 'job_searching', 10),
    (q4_id, 'Taking a break/Upskilling', 'upskilling', 11),
    (q4_id, 'Other', 'other', 12);
END $$;
```

