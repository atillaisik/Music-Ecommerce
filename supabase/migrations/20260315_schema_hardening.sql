-- Migration: Schema Hardening
-- Description: Links orders and reviews to profiles, and adds wishlist support.

-- 1. Add user_id to orders table
alter table public.orders 
add column if not exists user_id uuid references public.profiles(id) on delete set null;

-- 2. Update product_reviews to use UUID user_id
-- CAUTION: We must remove mock data that doesn't have a valid UUID as user_id
-- before we can change the column type, because the column is NOT NULL.

-- First, delete reviews with invalid UUIDs (mock data)
delete from public.product_reviews 
where user_id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Now safely alter the column type
alter table public.product_reviews 
alter column user_id type uuid using (user_id::uuid);

-- Add foreign key constraint to product_reviews safely
do $$
begin
    if not exists (select 1 from pg_constraint where conname = 'product_reviews_user_id_fkey') then
        alter table public.product_reviews 
        add constraint product_reviews_user_id_fkey 
        foreign key (user_id) references public.profiles(id) on delete cascade;
    end if;
end $$;

-- 3. Create wishlist_items table
create table if not exists public.wishlist_items (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    created_at timestamp with time zone default now(),
    unique(user_id, product_id)
);

-- Enable RLS for wishlist
alter table public.wishlist_items enable row level security;

-- Wishlist Policies
-- Drop existing policies if they exist to allow re-running the script
drop policy if exists "Users can manage their own wishlist" on public.wishlist_items;
drop policy if exists "Admins can view all wishlists" on public.wishlist_items;

create policy "Users can manage their own wishlist" on public.wishlist_items
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Admins can view all wishlists" on public.wishlist_items
    for select using (
        exists (
            select 1 from public.admin_users 
            where id = auth.uid() 
            and is_active = true 
            and role in ('super_admin', 'editor', 'viewer')
        )
    );
