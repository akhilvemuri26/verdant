-- Update the update_streak function with improved logic
CREATE OR REPLACE FUNCTION update_streak(
  user_id uuid,
  completed_at timestamp with time zone
)
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
  VALUES (user_id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Get last completion time
  SELECT streaks.last_completed_at, streaks.current_streak 
  INTO last_completion, current_streak_count
  FROM streaks
  WHERE streaks.user_id = user_id;

  -- Update streak based on completion time
  IF last_completion IS NULL THEN
    -- First ever completion
    UPDATE streaks
    SET 
      current_streak = 1,
      longest_streak = 1,
      last_completed_at = completed_at,
      updated_at = now()
    WHERE streaks.user_id = user_id;
  ELSIF completed_at::date = last_completion::date THEN
    -- Already completed today, no streak update needed
    RETURN;
  ELSIF completed_at::date = (last_completion + interval '1 day')::date THEN
    -- Streak continues
    UPDATE streaks
    SET 
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_completed_at = completed_at,
      updated_at = now()
    WHERE streaks.user_id = user_id;
  ELSE
    -- Streak broken (more than 1 day gap)
    UPDATE streaks
    SET 
      current_streak = 1,
      last_completed_at = completed_at,
      updated_at = now()
    WHERE streaks.user_id = user_id;
  END IF;
END;
$$;

