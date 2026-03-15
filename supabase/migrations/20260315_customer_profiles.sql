-- Migration: Add Customer Profiles
-- Description: Creates a profiles table for public page users and sets up RLS and triggers.

-- 1. Create Profiles Table
create table if not exists public.profiles (
    id uuid primary key references auth.users on delete cascade,
    full_name text,
    avatar_url text,
    phone text,
    address text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

-- 3. RLS Policies
-- Drop existing policies if they exist to allow re-running the script
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

-- Profiles are viewable by the owner and admins
create policy "Users can view their own profile" on public.profiles
    for select using (auth.uid() = id);

create policy "Admins can view all profiles" on public.profiles
    for select using (
        exists (
            select 1 from public.admin_users 
            where id = auth.uid() 
            and is_active = true 
            and role in ('super_admin', 'editor', 'viewer')
        )
    );

-- Users can update their own profile
create policy "Users can update their own profile" on public.profiles
    for update using (auth.uid() = id)
    with check (auth.uid() = id);

-- 4. Triggers for updated_at
drop trigger if exists handle_profiles_updated_at on public.profiles;
create trigger handle_profiles_updated_at 
    before update on public.profiles 
    for each row execute procedure public.handle_updated_at();

-- 5. Trigger to create profile automatically on signup
create or replace function public.handle_new_user_profile()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, avatar_url)
    values (
        new.id, 
        coalesce(new.raw_user_meta_data->>'full_name', ''), 
        coalesce(new.raw_user_meta_data->>'avatar_url', '')
    );
    return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid errors on reapplying
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user_profile();
