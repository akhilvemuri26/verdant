-- Create the decrement_eco_score function
create or replace function decrement_eco_score(user_id uuid, points integer)
returns void
language plpgsql
security definer
as $$
begin
  update profiles
  set 
    eco_score = greatest(0, eco_score - points),
    goals_completed = greatest(0, goals_completed - 1),
    updated_at = now()
  where profiles.user_id = $1;
end;
$$;

