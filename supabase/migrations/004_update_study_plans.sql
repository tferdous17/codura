-- Update problem_lists table to support user-created lists better
-- Add RLS policy for list items management

-- Create user_problem_lists table for user's personal lists (separate from official lists)
CREATE TABLE IF NOT EXISTS user_problem_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT 'from-brand to-orange-300',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_problem_lists_user_id ON user_problem_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_problem_lists_default ON user_problem_lists(user_id, is_default) WHERE is_default = true;

-- Enable Row Level Security (RLS)
ALTER TABLE user_problem_lists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_problem_lists
CREATE POLICY "Users can view own problem lists" ON user_problem_lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own problem lists" ON user_problem_lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own problem lists" ON user_problem_lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own problem lists" ON user_problem_lists
  FOR DELETE USING (auth.uid() = user_id);

-- Create user_list_problems table (junction table for user lists and problems)
CREATE TABLE IF NOT EXISTS user_list_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES user_problem_lists(id) ON DELETE CASCADE,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notes TEXT,
  order_index INTEGER,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(list_id, problem_id)
);

-- Create indexes for user_list_problems
CREATE INDEX IF NOT EXISTS idx_user_list_problems_list_id ON user_list_problems(list_id);
CREATE INDEX IF NOT EXISTS idx_user_list_problems_problem_id ON user_list_problems(problem_id);
CREATE INDEX IF NOT EXISTS idx_user_list_problems_user_id ON user_list_problems(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_list_problems ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_list_problems
CREATE POLICY "Users can view own list problems" ON user_list_problems
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own list problems" ON user_list_problems
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own list problems" ON user_list_problems
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own list problems" ON user_list_problems
  FOR DELETE USING (auth.uid() = user_id);

-- Add RLS policy for problem_list_items to allow users to insert items for their lists
CREATE POLICY "Users can insert items to own lists" ON problem_list_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM problem_lists
      WHERE id = list_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update items in own lists" ON problem_list_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM problem_lists
      WHERE id = list_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from own lists" ON problem_list_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM problem_lists
      WHERE id = list_id AND created_by = auth.uid()
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_user_problem_lists_updated_at BEFORE UPDATE ON user_problem_lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default "Saved Problems" list for new users
CREATE OR REPLACE FUNCTION create_default_saved_list()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_problem_lists (user_id, name, description, is_default, color)
  VALUES (
    NEW.id,
    'Saved Problems',
    'Your saved problems for quick access',
    true,
    'from-brand to-orange-300'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default list when user_stats is created (user signs up)
CREATE TRIGGER create_default_list_on_signup
  AFTER INSERT ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION create_default_saved_list();

-- Function to get user's problem lists with problem count
CREATE OR REPLACE FUNCTION get_user_problem_lists(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  color TEXT,
  is_default BOOLEAN,
  problem_count BIGINT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    upl.id,
    upl.name,
    upl.description,
    upl.color,
    upl.is_default,
    COUNT(ulp.id) as problem_count,
    upl.created_at
  FROM user_problem_lists upl
  LEFT JOIN user_list_problems ulp ON upl.id = ulp.list_id
  WHERE upl.user_id = p_user_id
  GROUP BY upl.id, upl.name, upl.description, upl.color, upl.is_default, upl.created_at
  ORDER BY upl.is_default DESC, upl.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;