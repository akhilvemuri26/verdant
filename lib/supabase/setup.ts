import { supabase } from "../supabase"

export async function setupDatabase() {
  try {
    // Check if goals table exists
    const { error: checkError } = await supabase.from("goals").select("id").limit(1)

    // If table doesn't exist, we'll get an error
    if (checkError?.message?.includes('relation "goals" does not exist')) {
      console.log("Tables do not exist, creating...")

      // Create tables using raw SQL
      const { error: createError } = await supabase.rpc("setup_database")
      if (createError) {
        console.error("Error creating tables:", createError)
        throw createError
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Setup database error:", error)
    throw error
  }
}

// SQL to run in Supabase SQL Editor:
/*
-- Create the setup_database function
create or replace function setup_database()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Create goals table if it doesn't exist
  create table if not exists goals (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    title text not null,
    completed boolean default false,
    timeline text not null,
    category text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone
  );

  -- Create profiles table if it doesn't exist
  create table if not exists profiles (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null unique,
    eco_score integer default 0,
    goals_completed integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Enable RLS
  alter table goals enable row level security;
  alter table profiles enable row level security;

  -- Create policies for goals
  do $$
  begin
    if not exists (
      select 1 from pg_policies where tablename = 'goals' and policyname = 'Users can view their own goals'
    ) then
      create policy "Users can view their own goals"
        on goals for select
        using (auth.uid() = user_id);
    end if;

    if not exists (
      select 1 from pg_policies where tablename = 'goals' and policyname = 'Users can insert their own goals'
    ) then
      create policy "Users can insert their own goals"
        on goals for insert
        with check (auth.uid() = user_id);
    end if;

    if not exists (
      select 1 from pg_policies where tablename = 'goals' and policyname = 'Users can update their own goals'
    ) then
      create policy "Users can update their own goals"
        on goals for update
        using (auth.uid() = user_id);
    end if;
  end $$;

  -- Create policies for profiles
  do $$
  begin
    if not exists (
      select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can view their own profile'
    ) then
      create policy "Users can view their own profile"
        on profiles for select
        using (auth.uid() = user_id);
    end if;

    if not exists (
      select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update their own profile'
    ) then
      create policy "Users can update their own profile"
        on profiles for update
        using (auth.uid() = user_id);
    end if;

    if not exists (
      select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can insert their own profile'
    ) then
      create policy "Users can insert their own profile"
        on profiles for insert
        with check (auth.uid() = user_id);
    end if;
  end $$;
end;
$$;

-- Create the increment_eco_score function
create or replace function increment_eco_score(user_id uuid, points integer)
returns void
language plpgsql
security definer
as $$
begin
  insert into profiles (user_id, eco_score, goals_completed)
  values (user_id, points, 1)
  on conflict (user_id)
  do update set
    eco_score = profiles.eco_score + points,
    goals_completed = profiles.goals_completed + 1,
    updated_at = now();
end;
$$;
*/

