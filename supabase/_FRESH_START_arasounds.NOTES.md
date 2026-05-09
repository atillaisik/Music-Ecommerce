# Fresh Start — How to apply `_FRESH_START_arasounds.sql`

This single file represents the **complete schema** for the ArasSounds project, after IMPLEMENTATION_2 → IMPLEMENTATION_16 Phase 1. Apply it once to a brand-new Supabase project. Idempotent — safe to re-run.

## Step-by-step

1. **Open the new project's SQL Editor**
   `https://supabase.com/dashboard/project/bzvmvbhzfpqxtfqeojak/sql/new`

2. **Open the bundle file locally**
   `Music-Ecommerce/supabase/_FRESH_START_arasounds.sql`
   Select all → copy.

3. **Paste into the SQL Editor → Run** (Ctrl/Cmd + Enter)
   Should report `Success. No rows returned` and finish in 1–3 seconds.

4. **Run the 8 verification queries** at the bottom of the bundle file (uncomment them one at a time):

   | # | Expectation |
   |---|-------------|
   | 1 | 14 public tables |
   | 2 | 3 storage buckets: `product-images`, `admin-uploads`, `avatars` |
   | 3 | Every public table shows `rowsecurity = t` |
   | 4 | Every table has ≥1 policy |
   | 5 | `orders` shows `Allow order creation by self or guest` (INSERT), `Users can read own orders` (SELECT), `Admins can manage all orders` (ALL) |
   | 6 | `product_reviews` INSERT policy is `Reviews insert by self or guest` (NOT the old permissive `with check (true)` one) |
   | 7 | `products` has `featured boolean default false not null` and `on_sale boolean default false not null` |
   | 8 | At least 4 storage policies match `%avatar%` |

5. **Tell me the verification results.** A simple "all 8 pass" is enough.

## Create the first super admin

After the schema is in place, you need one super_admin to be able to access `/admin/*`.

1. Go to **Authentication → Users → Add user → Create new user**
2. Email: `you@example.com` (use a real one — Supabase will require email confirmation if enabled)
3. Set a strong password
4. Note the resulting user UUID (visible in the user row)
5. Go back to **SQL Editor** and run:
   ```sql
   insert into public.admin_users (id, email, role, is_active)
   values (
       '<paste-uuid-here>'::uuid,
       'you@example.com',
       'super_admin',
       true
   );
   ```
6. Confirm with:
   ```sql
   select id, email, role, is_active from public.admin_users;
   ```

This is a one-time bootstrap. From now on, additional admins are created via the admin UI (Phase 2 work).

## What the bundle does NOT do

- **No seed data.** No products, no categories, no brands. Phase 4 (mock data retirement) will move the old `src/data/mock.ts` content into `scripts/seed-data.ts`. Until then, you can manually add a couple of categories/brands/products via the admin UI to test.
- **No Edge Functions.** None defined.
- **No `pg_cron` jobs.** The `create_daily_analytics_snapshot()` function is defined but not scheduled.

## If something fails

- **"relation already exists"** — should not happen since everything uses `if not exists`. If it does, the bundle is partial-applied; the easiest fix is to drop the public schema and re-run. From the Supabase Studio SQL Editor:
  ```sql
  drop schema public cascade;
  create schema public;
  grant all on schema public to postgres, anon, authenticated, service_role;
  ```
  Then re-run the bundle.
- **"role 'authenticator' does not exist"** — a Supabase setup issue, not a bundle issue. Contact Supabase support.
- **Anything else** — paste the error here and I'll fix the bundle.

## After this is done

Once the bundle applies cleanly and the super_admin user is created, we can move to **IMPLEMENTATION_16 Phase 2: Supabase-backed admin auth**.

The migration files in `supabase/migrations/` (the original 9 + the new Phase 1) are still useful as historical record — they document how the schema evolved. They are NOT meant to be applied to this fresh project. The bundle is the authoritative starting point for `bzvmvbhzfpqxtfqeojak`.
