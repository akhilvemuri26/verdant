-- Update the increment_eco_score function to ensure proper scaling
CREATE OR REPLACE FUNCTION increment_eco_score(
  points integer,
  user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Scale points to ensure total score stays within 0-100 range
  -- First get current score
  DECLARE
    current_score decimal;
  BEGIN
    SELECT eco_score INTO current_score
    FROM profiles
    WHERE profiles.user_id = $2;

    -- Calculate new score, ensuring it doesn't exceed 100
    UPDATE profiles
    SET 
      eco_score = LEAST(100, ROUND(COALESCE(current_score, 0) + ($1 * 0.1), 2)),
      goals_completed = goals_completed + 1,
      updated_at = now()
    WHERE profiles.user_id = $2;

    -- Insert points history
    INSERT INTO goal_points_history (user_id, points, created_at)
    VALUES ($2, $1, now());
  END;
END;
$$;

-- Update the decrement_eco_score function to match
CREATE OR REPLACE FUNCTION decrement_eco_score(
  points integer,
  user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update profile ensuring score doesn't go below 0
  UPDATE profiles
  SET 
    eco_score = GREATEST(0, ROUND(eco_score - ($1 * 0.1), 2)),
    goals_completed = GREATEST(0, goals_completed - 1),
    updated_at = now()
  WHERE profiles.user_id = $2;

  -- Remove points from history
  DELETE FROM goal_points_history
  WHERE user_id = $2
  AND created_at = (
    SELECT created_at
    FROM goal_points_history
    WHERE user_id = $2
    ORDER BY created_at DESC
    LIMIT 1
  );
END;
$$;

