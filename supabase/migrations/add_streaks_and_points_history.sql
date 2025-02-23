-- Create goal_points_history table
CREATE TABLE IF NOT EXISTS public.goal_points_history (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points decimal NOT NULL,
  timeline text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create streaks table
CREATE TABLE IF NOT EXISTS public.streaks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.goal_points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own points history"
  ON public.goal_points_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own points history"
  ON public.goal_points_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own streaks"
  ON public.streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON public.streaks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks"
  ON public.streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to update streaks
CREATE OR REPLACE FUNCTION update_streak(user_id uuid, completed_at timestamp with time zone)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  last_completion timestamp;
  current_streak_count integer;
BEGIN
  -- Get or create streak record
  INSERT INTO streaks (user_id, current_streak, longest_streak)
  VALUES ($1, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Get last completion time
  SELECT last_completed_at, current_streak INTO last_completion, current_streak_count
  FROM streaks
  WHERE streaks.user_id = $1;

  -- Update streak based on completion time
  IF last_completion IS NULL OR completed_at::date = (last_completion + interval '1 day')::date THEN
    -- Streak continues
    UPDATE streaks
    SET 
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_completed_at = completed_at,
      updated_at = now()
    WHERE streaks.user_id = $1;
  ELSIF completed_at::date > (last_completion + interval '1 day')::date THEN
    -- Streak broken
    UPDATE streaks
    SET 
      current_streak = 1,
      last_completed_at = completed_at,
      updated_at = now()
    WHERE streaks.user_id = $1;
  END IF;
END;
$$;

-- Function to reset streak
CREATE OR REPLACE FUNCTION reset_streak(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE streaks
  SET 
    current_streak = 0,
    last_completed_at = NULL,
    updated_at = now()
  WHERE streaks.user_id = $1;
END;
$$;

