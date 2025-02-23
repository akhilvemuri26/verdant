export type Goal = {
  id: string
  user_id: string
  title: string
  completed: boolean
  timeline: "yearly" | "monthly" | "weekly" | "daily"
  category: "energy" | "water" | "waste" | "transport" | "lifestyle"
  created_at: string
  completed_at?: string | null
}

export type UserProfile = {
  id: string
  user_id: string
  eco_score: number
  goals_completed: number
  created_at: string
}

// SQL for creating tables and functions:
/*
-- Create the increment function
create or replace function increment(row_id uuid, amount int)
returns int
language plpgsql
as $$
declare
  current_value int;
begin
  select eco_score into current_value
  from user_profiles
  where user_id = row_id;
  
  return coalesce(current_value, 0) + amount;
end;
$$;

-- Create the decrement function
create or replace function decrement(row_id uuid, amount int)
returns int
language plpgsql
as $$
declare
  current_value int;
begin
  select eco_score into current_value
  from user_profiles
  where user_id = row_id;
  
  return greatest(0, coalesce(current_value, 0) - amount);
end;
$$;

-- Create goals table if it doesn't exist
create table if not exists public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  completed boolean default false,
  timeline text not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Create user_profiles table if it doesn't exist
create table if not exists public.user_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  eco_score integer default 0,
  goals_completed integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.goals enable row level security;
alter table public.user_profiles enable row level security;

-- Create policies
create policy "Users can view their own goals"
on public.goals for select
using (auth.uid() = user_id);

create policy "Users can insert their own goals"
on public.goals for insert
with check (auth.uid() = user_id);

create policy "Users can update their own goals"
on public.goals for update
using (auth.uid() = user_id);

create policy "Users can view their own profile"
on public.user_profiles for select
using (auth.uid() = user_id);

create policy "Users can update their own profile"
on public.user_profiles for update
using (auth.uid() = user_id);

create policy "Users can insert their own profile"
on public.user_profiles for insert
with check (auth.uid() = user_id);
*/

