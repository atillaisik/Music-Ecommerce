# Apply Notes — IMPLEMENTATION_16 Phase 1 RLS Migration

File: `20260428_implementation_16_rls.sql`

## What it does

1. **`orders`** — `user_id` nullable; new INSERT policy that pins authed users to `auth.uid()` and lets guests (no session) insert with `user_id IS NULL`. SELECT replaced to cover both `auth.uid() = user_id` and the legacy `customer_email` path.
2. **`order_items`** — new INSERT policy that mirrors the parent order's permission.
3. **`product_reviews`** — `user_id` nullable; `reviewer_email` column added; permissive `with check (true)` insert policy replaced with one that requires `user_name` and pins `user_id` to the session (or NULL for guests). Two partial unique indexes prevent duplicate reviews per `(product, actor)`.
4. **`profiles`** — `protect_profile_immutables_trigger` blocks any UPDATE that changes `id` (defense-in-depth on top of existing RLS).
5. **`admin_users`** — re-asserts the self-read policy idempotently.
6. **`storage.avatars`** — new public bucket; users may upload/update/delete only under `avatars/<their-uid>/...`.
7. **`products`** — additive `featured` and `on_sale` boolean columns plus partial indexes.

## How to apply

Pick one path. The migration is idempotent, so re-applies are safe.

### Option A — Supabase Studio SQL Editor (recommended for one-off)

1. Open the project's SQL editor: `https://app.supabase.com/project/<PROJECT_REF>/sql/new`.
2. Paste the contents of `20260428_implementation_16_rls.sql`.
3. Run.
4. Then run each of the verification queries at the bottom of the SQL file. Confirm expected rows exist.

### Option B — Supabase CLI (recommended for repo-tracked deploys)

```sh
# from Music-Ecommerce/
supabase login           # if not already
supabase link --project-ref <PROJECT_REF>
supabase db push         # applies any new files in supabase/migrations
```

`supabase db push` will detect this file and apply it.

### Option C — psql

```sh
psql "<DATABASE_URL>" -f supabase/migrations/20260428_implementation_16_rls.sql
```

## Rollback

The migration creates additive columns/policies/buckets and modifies one nullability + one INSERT policy. To roll back:

```sql
begin;

-- 1. orders
drop policy if exists "Allow order creation by self or guest" on public.orders;
drop policy if exists "Users can read own orders" on public.orders;
-- Recreate the prior SELECT policy if needed
create policy "Users can read own orders based on email" on public.orders
    for select using (
        customer_email = auth.jwt() ->> 'email'
        or exists (select 1 from public.admin_users where id = auth.uid() and is_active = true)
    );

-- 2. order_items
drop policy if exists "Allow order_items insert with order" on public.order_items;

-- 3. product_reviews
drop policy if exists "Reviews insert by self or guest" on public.product_reviews;
create policy "Allow public insert for product reviews"
    on public.product_reviews for insert with check (true);
drop index if exists product_reviews_unique_user_idx;
drop index if exists product_reviews_unique_guest_idx;
alter table public.product_reviews drop column if exists reviewer_email;
-- Note: setting user_id back to NOT NULL will fail if any guest reviews now exist.

-- 4. profiles
drop trigger if exists protect_profile_immutables_trigger on public.profiles;
drop function if exists public.protect_profile_immutables();

-- 6. avatars storage
drop policy if exists "Public read for avatars" on storage.objects;
drop policy if exists "Users upload own avatar" on storage.objects;
drop policy if exists "Users update own avatar" on storage.objects;
drop policy if exists "Users delete own avatar" on storage.objects;
delete from storage.buckets where id = 'avatars';

-- 7. products columns
drop index if exists products_featured_idx;
drop index if exists products_on_sale_idx;
alter table public.products drop column if exists featured;
alter table public.products drop column if exists on_sale;

commit;
```

## Post-apply: known follow-ups

These are tracked in `IMPLEMENTATION_16.md`:

- **Phase 3 must follow promptly.** The new `product_reviews` INSERT policy requires `user_name`, so `useAddReview` (`src/lib/reviewAPI.ts`) must capture it from the form before Phase 3 ships, or guest review submissions silently fail.
- **`useCreateOrder`** must resolve `user_id` from `supabase.auth.getUser()` (not from caller input). Until it does, any client that passes a fake `user_id` will be rejected by the new policy — which is correct, but will surface as user-visible errors.
- **`imageUploader.ts`** still uses the anon client; Phase 6 must be reached before image uploads will work under tightened admin-bucket policies (those policies are unchanged in this migration, but Phase 2 admin auth migration may unblock genuine admin sessions).

## Verification commands inside the SQL file

The bottom of `20260428_implementation_16_rls.sql` lists six SELECT statements you should run in the SQL Editor after applying. Each comment explains what the expected row(s) look like. Record results in `IMPLEMENTATION_16.md` under Phase 10 ids 47–62.
