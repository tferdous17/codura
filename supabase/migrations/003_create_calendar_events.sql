-- Create calendar_events table for user calendar functionality
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('solve_problem', 'mock_interview', 'study_pod', 'live_stream', 'other')),
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  problem_id INTEGER REFERENCES problems(id) ON DELETE SET NULL,
  is_completed BOOLEAN DEFAULT false,
  reminder_minutes INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (start_time IS NULL OR end_time IS NULL OR start_time < end_time)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON calendar_events(event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date ON calendar_events(user_id, event_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(event_type);

-- Enable Row Level Security (RLS)
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for calendar_events
CREATE POLICY "Users can view own calendar events" ON calendar_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendar events" ON calendar_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar events" ON calendar_events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar events" ON calendar_events
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get events for a specific month
CREATE OR REPLACE FUNCTION get_calendar_events_for_month(
  p_user_id UUID,
  p_year INTEGER,
  p_month INTEGER
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  event_type TEXT,
  event_date DATE,
  start_time TIME,
  end_time TIME,
  problem_id INTEGER,
  is_completed BOOLEAN,
  metadata JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.id,
    ce.title,
    ce.description,
    ce.event_type,
    ce.event_date,
    ce.start_time,
    ce.end_time,
    ce.problem_id,
    ce.is_completed,
    ce.metadata
  FROM calendar_events ce
  WHERE ce.user_id = p_user_id
    AND EXTRACT(YEAR FROM ce.event_date) = p_year
    AND EXTRACT(MONTH FROM ce.event_date) = p_month
  ORDER BY ce.event_date, ce.start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;