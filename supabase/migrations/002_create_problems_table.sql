-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
  id SERIAL PRIMARY KEY,
  leetcode_id INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  title_slug TEXT UNIQUE NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  acceptance_rate DECIMAL(5,2),
  topic_tags JSONB DEFAULT '[]'::jsonb,
  is_premium BOOLEAN DEFAULT false,
  has_solution BOOLEAN DEFAULT false,
  has_video_solution BOOLEAN DEFAULT false,
  description TEXT,
  examples JSONB DEFAULT '[]'::jsonb,
  constraints TEXT,
  hints JSONB DEFAULT '[]'::jsonb,
  code_snippets JSONB DEFAULT '[]'::jsonb,
  total_submissions INTEGER DEFAULT 0,
  total_accepted INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_problem_progress table (tracks which problems users have solved)
CREATE TABLE IF NOT EXISTS user_problem_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('Solved', 'Attempted', 'Todo')),
  last_submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,
  last_attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, problem_id)
);

-- Create problem_lists table (for curated lists like NeetCode 150, Blind 75)
CREATE TABLE IF NOT EXISTS problem_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  total_problems INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_official BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create problem_list_items table (junction table for lists and problems)
CREATE TABLE IF NOT EXISTS problem_list_items (
  list_id UUID REFERENCES problem_lists(id) ON DELETE CASCADE,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  notes TEXT,
  PRIMARY KEY (list_id, problem_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_title_slug ON problems(title_slug);
CREATE INDEX IF NOT EXISTS idx_problems_is_premium ON problems(is_premium);
CREATE INDEX IF NOT EXISTS idx_problems_topic_tags ON problems USING GIN (topic_tags);
CREATE INDEX IF NOT EXISTS idx_user_problem_progress_user_id ON user_problem_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_problem_progress_status ON user_problem_progress(status);
CREATE INDEX IF NOT EXISTS idx_problem_list_items_list_id ON problem_list_items(list_id);

-- Enable Row Level Security (RLS)
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_problem_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_list_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for problems (public read)
CREATE POLICY "Anyone can view problems" ON problems
  FOR SELECT USING (true);

-- RLS Policies for user_problem_progress
CREATE POLICY "Users can view own progress" ON user_problem_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_problem_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_problem_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for problem_lists
CREATE POLICY "Anyone can view problem lists" ON problem_lists
  FOR SELECT USING (true);

CREATE POLICY "Users can create lists" ON problem_lists
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own lists" ON problem_lists
  FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for problem_list_items
CREATE POLICY "Anyone can view list items" ON problem_list_items
  FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_problems_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON problems
  FOR EACH ROW EXECUTE FUNCTION update_problems_updated_at();

CREATE TRIGGER update_problem_lists_updated_at BEFORE UPDATE ON problem_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default problem lists
INSERT INTO problem_lists (name, description, icon, color, total_problems, is_official) VALUES
  ('NeetCode 150', 'Curated list of 150 essential problems', 'Target', 'from-brand to-orange-300', 150, true),
  ('Blind 75', 'Top 75 LeetCode questions for interviews', 'Trophy', 'from-purple-500 to-pink-500', 75, true),
  ('Grind 75', 'Study plan by a Google engineer', 'Sparkles', 'from-blue-500 to-cyan-500', 75, true),
  ('Top Interview 150', 'Most frequently asked in interviews', 'Star', 'from-yellow-500 to-orange-500', 150, true)
ON CONFLICT DO NOTHING;
