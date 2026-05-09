-- Migration: IMPLEMENTATION_16 Phase 1 — RLS Hardening
-- Date: 2026-04-28
-- Purpose:
--   1. Allow guest checkout (orders with user_id IS NULL).
--   2. Force authed checkouts to attach user_id = auth.uid() (anti-spoofing).
--   3. Allow anonymous product reviews with reviewer_name/reviewer_email.
--   4. Lock down profile updates (id is immutable).
--   5. Confirm admin_users self-read policy.
--   6. Provision avatars storage bucket with user-scoped writes.
--   7. Add featured / on_sale product flags (consumed in Phase 4).
--
-- This migration is idempotent — safe to re-run.
--
-- DEPLOYMENT NOTE: After applying, the public INSERT policy on product_reviews
-- becomes stricter. The front-end must pass either auth.uid() (signed in) or
-- a non-null user_name + null user_id (guest) — see IMPLEMENTATION_16 Phase 3
-- for the matching reviewAPI changes. Until Phase 3 ships, signed-out review
-- submissions that don't include user_name will be rejected by the policy.

begin;

-- ============================================================
-- 1. ORDERS — guest checkout + anti-spoof user_id
-- ============================================================

-- Make user_id nullable (defensive — already nullable per 20260315)
alter table public.orders
    alter column user_id drop not null;

-- INSERT policy: signed-in users must use their own auth.uid();
-- guests (no session) must use NULL.
drop policy if exists "Allow order creation by self or guest" on public.orders;
create policy "Allow order creation by self or guest" on public.orders
    for insert
    with check (
        (auth.uid() is not null and user_id = auth.uid())
        or (auth.uid() is null and user_id is null)
    );

-- SELECT policy: replace email-only policy with one that also covers user_id-by-uid.
drop policy if exists "Users can read own orders based on email" on public.orders;
drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders" on public.orders
    for select using (
        (auth.uid() is not null and user_id = auth.uid())
        or (customer_email = auth.jwt() ->> 'email')
        or exists (
            select 1 from public.admin_users
            where id = auth.uid() and is_active = true
        )
    );

-- (existing "Admins can manage all orders" policy remains for UPDATE/DELETE)

-- ============================================================
-- 2. ORDER_ITEMS — INSERT policy mirroring parent order
-- ============================================================

drop policy if exists "Allow order_items insert with order" on public.order_items;
create policy "Allow order_items insert with order" on public.order_items
    for insert
    with check (
        exists (
            select 1 from public.orders o
            where o.id = order_id
              and (
                (auth.uid() is not null and o.user_id = auth.uid())
                or (auth.uid() is null and o.user_id is null)
              )
        )
    );

-- (existing SELECT and "Admins can manage all order items" policies remain)

-- ============================================================
-- 3. PRODUCT_REVIEWS — anonymous reviews with reviewer info
-- ============================================================

-- Make user_id nullable (was NOT NULL UUID after 20260315 hardening)
alter table public.product_reviews
    alter column user_id drop not null;

-- Add reviewer_email for guest contact (optional; user_name already exists)
alter table public.product_reviews
    add column if not exists reviewer_email text;

-- Replace the permissive `with check (true)` policy with a hardened one.
drop policy if exists "Allow public insert for product reviews" on public.product_reviews;
drop policy if exists "Reviews insert by self or guest" on public.product_reviews;
create policy "Reviews insert by self or guest" on public.product_reviews
    for insert
    with check (
        user_name is not null and length(trim(user_name)) > 0
        and (
            (auth.uid() is not null and user_id = auth.uid())
            or (auth.uid() is null and user_id is null)
        )
    );

-- Spam guard: prevent the same authed user or the same guest email from
-- reviewing the same product twice. Partial unique indexes scoped per actor.
create unique index if not exists product_reviews_unique_user_idx
    on public.product_reviews (product_id, user_id)
    where user_id is not null;

create unique index if not exists product_reviews_unique_guest_idx
    on public.product_reviews (product_id, reviewer_email)
    where user_id is null and reviewer_email is not null;

-- ============================================================
-- 4. PROFILES — id immutability guard (defense-in-depth)
-- ============================================================
-- (RLS on UPDATE already correct: using + with check both auth.uid() = id.)
-- This trigger blocks any sneaky id rewrite even if RLS were bypassed.

create or replace function public.protect_profile_immutables()
returns trigger
language plpgsql
security definer
as $$
begin
    if new.id is distinct from old.id then
        raise exception 'profiles.id is immutable';
    end if;
    return new;
end;
$$;

drop trigger if exists protect_profile_immutables_trigger on public.profiles;
create trigger protect_profile_immutables_trigger
    before update on public.profiles
    for each row execute procedure public.protect_profile_immutables();

-- ============================================================
-- 5. ADMIN_USERS — confirm self-read policy
-- ============================================================
-- Already created in 20260312_ensure_constraints.sql + 20260312_fix_site_content_rls.sql.
-- Re-assert idempotently in case either migration was skipped.

do $$
begin
    if not exists (
        select 1 from pg_policies
        where tablename = 'admin_users'
          and policyname = 'Allow users to read their own record'
    ) then
        create policy "Allow users to read their own record" on public.admin_users
            for select using (auth.uid() = id);
    end if;
end $$;

-- ============================================================
-- 6. AVATARS STORAGE BUCKET (new) — user-scoped writes
-- ============================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Public read
drop policy if exists "Public read for avatars" on storage.objects;
create policy "Public read for avatars" on storage.objects
    for select using (bucket_id = 'avatars');

-- User-scoped insert: path must start with the authenticated user's UUID.
-- E.g. avatars/<auth.uid()>/profile.png
drop policy if exists "Users upload own avatar" on storage.objects;
create policy "Users upload own avatar" on storage.objects
    for insert
    with check (
        bucket_id = 'avatars'
        and auth.uid() is not null
        and (storage.foldername(name))[1] = auth.uid()::text
    );

drop policy if exists "Users update own avatar" on storage.objects;
create policy "Users update own avatar" on storage.objects
    for update using (
        bucket_id = 'avatars'
        and auth.uid() is not null
        and (storage.foldername(name))[1] = auth.uid()::text
    );

drop policy if exists "Users delete own avatar" on storage.objects;
create policy "Users delete own avatar" on storage.objects
    for delete using (
        bucket_id = 'avatars'
        and auth.uid() is not null
        and (storage.foldername(name))[1] = auth.uid()::text
    );

-- ============================================================
-- 7. PRODUCTS — featured / on_sale flags (used in Phase 4)
-- ============================================================
-- Additive, default false, safe for existing rows.

alter table public.products
    add column if not exists featured boolean default false not null;

alter table public.products
    add column if not exists on_sale boolean default false not null;

-- Helpful indexes for the Index page queries (`useProducts({ featured: true })`)
create index if not exists products_featured_idx
    on public.products (featured)
    where featured = true;

create index if not exists products_on_sale_idx
    on public.products (on_sale)
    where on_sale = true;

commit;

-- ============================================================
-- POST-APPLY VERIFICATION QUERIES
-- ============================================================
-- Run these after applying. Expected results in the comments.
--
-- 1. Confirm orders has the new INSERT and SELECT policies.
-- select policyname, cmd from pg_policies where tablename = 'orders' order by policyname;
-- Expected rows include:
--   "Allow order creation by self or guest" / INSERT
--   "Users can read own orders" / SELECT
--   "Admins can manage all orders" / ALL
--
-- 2. Confirm order_items insert policy.
-- select policyname, cmd from pg_policies where tablename = 'order_items' order by policyname;
-- Expected: "Allow order_items insert with order" / INSERT
--
-- 3. Confirm product_reviews policies.
-- select policyname, cmd from pg_policies where tablename = 'product_reviews' order by policyname;
-- Expected: "Reviews insert by self or guest" / INSERT (no policy with `with check (true)`)
--
-- 4. Confirm product_reviews columns.
-- select column_name, is_nullable from information_schema.columns
--   where table_schema='public' and table_name='product_reviews' order by ordinal_position;
-- Expected: user_id is_nullable = YES; reviewer_email exists.
--
-- 5. Confirm avatars bucket exists.
-- select id, name, public from storage.buckets where id = 'avatars';
-- Expected: one row.
--
-- 6. Confirm products has the new columns.
-- select column_name from information_schema.columns
--   where table_schema='public' and table_name='products' and column_name in ('featured','on_sale');
-- Expected: two rows.
