-- Update the increment_eco_score function to use named parameters
CREATE OR REPLACE FUNCTION increment_eco_score(
  user_id uuid,
  points integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
-- Update profile with new score
UPDATE profiles
SET 
  eco_score = ROUND((eco_score + points)::numeric, 2),
  goals_completed = goals_completed + 1,
  updated_at = now()
WHERE profiles.user_id = user_id;

-- Insert points history
INSERT INTO goal_points_history (user_id, points, created_at)
VALUES (user_id, points, now());
END;
$$;

-- Update the decrement_eco_score function to use named parameters
CREATE OR REPLACE FUNCTION decrement_eco_score(
  user_id uuid,
  points integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
-- Update profile
UPDATE profiles
SET 
  eco_score = ROUND(GREATEST(0, eco_score - points)::numeric, 2),
  goals_completed = GREATEST(0, goals_completed - 1),
  updated_at = now()
WHERE profiles.user_id = user_id;

-- Remove points from history
DELETE FROM goal_points_history
WHERE goal_points_history.user_id = user_id
AND created_at = (
  SELECT created_at
  FROM goal_points_history
  WHERE goal_points_history.user_id = user_id
  ORDER BY created_at DESC
  LIMIT 1
);
END;
$$;

-- Update the update_streak function to use named parameters
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
  SELECT streaks.last_completed_at, streaks.current_streak INTO last_completion, current_streak_count
  FROM streaks
  WHERE streaks.user_id = user_id;

  -- Update streak based on completion time
  IF last_completion IS NULL OR completed_at::date = (last_completion + interval '1 day')::date THEN
    -- Streak continues
    UPDATE streaks
    SET 
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_completed_at = completed_at,
      updated_at = now()
    WHERE streaks.user_id = user_id;
  ELSIF completed_at::date > (last_completion + interval '1 day')::date THEN
    -- Streak broken
    UPDATE streaks
    SET 
      current_streak = 1,
      last_completed_at = completed_at,
      updated_at = now()
    WHERE streaks.user_id = user_id;
  END IF;
END;
$$;

