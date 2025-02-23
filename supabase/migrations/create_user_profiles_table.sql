-- Create user_profiles table
create table if not exists public.user_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  -- Energy Usage
  electricity_consumption int, -- Q1
  renewable_energy text, -- Q2
  heating_type text, -- Q3
  -- Water Usage
  shower_duration int, -- Q4
  water_efficient_appliances boolean, -- Q5
  watering_frequency text, -- Q6
  -- Household
  household_size int, -- Q7
  home_age text, -- Q8
  efficiency_upgrades text[], -- Q9
  -- Transportation
  primary_transport text, -- Q10
  weekly_driving_miles int, -- Q11
  air_travel_frequency text, -- Q12
  -- Lifestyle
  meat_consumption int, -- Q13
  clothing_frequency text, -- Q14
  recycles boolean, -- Q15
  food_waste text, -- Q16
  -- Location
  location text, -- Q17
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

