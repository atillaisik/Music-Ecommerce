# IMPLEMENTATION_16: Critical Security, RLS Hardening & Stack Cleanup

This phase resolves the five critical issues and ~25 design questions surfaced by the code review (`/Users/atillaisik/.claude/plans/review-our-current-code-humble-hickey.md`).

## Decisions (from user)

| # | Question | Decision |
|---|----------|----------|
| 1 | Admin auth model | **Migrate to Supabase Auth + `admin_users` table.** Supabase MCP will be linked so Claude can apply migrations directly. |
| 2 | Guest checkout supported | **Yes.** `orders.user_id` becomes nullable; anon INSERT allowed; `auth.uid()` captured when present. |
| 3 | Anonymous reviews allowed | **Yes.** `product_reviews.user_id` becomes nullable; anon INSERT allowed; reviewer name captured for guest reviews. |
| 4 | Mock data | **Fully retire.** Best practice: single source of truth (Supabase). All pages/components migrate to live data; `src/data/mock.ts` is removed once nothing imports it. Seed scripts retained under `scripts/` for dev. |
| 5 | Package manager | **npm.** Remove `bun.lockb`. |

> **Order matters.** Phases below are dependency-ordered. Do not skip ahead — Phase 2 needs Phase 1's `admin_users` table to be policy-correct, etc.

---

## Phase 1: Database & RLS Hardening

**Status:** ✅ **APPLIED** to project `zblhzozbsgvgrpwbotnq` ("Arassounds", eu-central-1) on 2026-04-28 via the Supabase MCP. All 9 prior migrations + the new Phase 1 migration + an advisor-cleanup follow-up have been applied. All 6 verification SELECTs pass. Security advisor is clean for our functions (only the platform-level `rls_auto_enable` and the public-bucket-listing WARN remain — the latter is in scope for Phase 6).

Migration files:
- [`supabase/migrations/20260428_implementation_16_rls.sql`](supabase/migrations/20260428_implementation_16_rls.sql) — main Phase 1 RLS changes.
- [`supabase/migrations/20260428_implementation_16_advisor_cleanup.sql`](supabase/migrations/20260428_implementation_16_advisor_cleanup.sql) — `search_path` pinning, EXECUTE revokes from PUBLIC, audit-table SELECT policies, and SECURITY DEFINER on the trigger functions that need to write across RLS.

- [x] **`orders` table** <!-- id: 1 -->
    - [x] Make `user_id` nullable (idempotent `drop not null`).
    - [x] Add INSERT policy: `(auth.uid() is not null and user_id = auth.uid()) or (auth.uid() is null and user_id is null)` — pins authed users to their own uid, allows anon guests with NULL.
    - [x] SELECT policy rewritten to cover both `user_id = auth.uid()` AND legacy `customer_email = jwt email`, plus admin escape hatch.
    - [x] UPDATE remains admin-only via existing `Admins can manage all orders` policy.
- [x] **`order_items` table** <!-- id: 2 -->
    - [x] Added INSERT policy that does an EXISTS subquery against the parent order's `user_id` permission — works in same-transaction inserts because the parent order row is visible.
    - [x] SELECT/UPDATE policies inherited from existing `Users can read own order items` and `Admins can manage all order items`.
- [x] **`product_reviews` table** <!-- id: 3 -->
    - [x] `user_id` made nullable (was NOT NULL UUID after 20260315 hardening).
    - [x] Added `reviewer_email` column (text, nullable). `user_name` was already NOT NULL — serves as `reviewer_name`.
    - [x] Permissive `with check (true)` policy replaced with: requires non-empty `user_name`, AND pins user_id to session (or NULL for guests).
    - [x] Spam guard implemented as two partial unique indexes: `(product_id, user_id) where user_id is not null` and `(product_id, reviewer_email) where user_id is null and reviewer_email is not null`.
    - [x] UPDATE/DELETE remain admin-only via existing `Allow admin write access for product reviews`.
- [x] **`profiles` table** <!-- id: 4 -->
    - [x] Confirmed existing UPDATE policy already has both `using` and `with check` clauses (`auth.uid() = id`).
    - [x] Added `protect_profile_immutables_trigger` (BEFORE UPDATE) that blocks any change to `id`. Profiles has no `email` or `role` columns, so column-level protection unnecessary.
- [x] **`admin_users` table** <!-- id: 5 -->
    - [x] FK to `auth.users(id)` already in place from `20260303_initial_schema.sql:83`.
    - [x] Required columns (`role`, `is_active`, `created_at`, `updated_at`, `last_login`) all present.
    - [x] Self-read policy re-asserted idempotently in case earlier migration was skipped.
    - [x] Super-admin INSERT/UPDATE policy already in place from initial schema.
- [x] **Storage buckets** <!-- id: 6 -->
    - [x] `product-images` and `admin-uploads` policies were already created in `20260303_initial_schema.sql:196-204` — no changes needed.
    - [x] New `avatars` public bucket created (idempotent `on conflict do nothing`).
    - [x] User-scoped INSERT/UPDATE/DELETE policies require path prefix to match `auth.uid()::text` via `storage.foldername(name)[1]`.
- [x] **Bonus — products `featured` and `on_sale` columns** (Phase 4 follow-up baked in)
    - [x] Both columns added with `default false not null` plus partial indexes for fast `where featured = true` queries.

### Phase 1 — Apply checklist

- [x] **Apply migration** via Supabase MCP `apply_migration`. <!-- id: 1a -->
- [x] **Run the 6 verification queries** — all confirmed: <!-- id: 1b -->
    - Orders: 3 policies (INSERT "Allow order creation by self or guest", SELECT "Users can read own orders", ALL "Admins can manage all orders").
    - Order_items: 3 policies (INSERT "Allow order_items insert with order", SELECT, ALL).
    - Product_reviews: 3 policies (INSERT "Reviews insert by self or guest", SELECT, ALL). The old permissive `with check (true)` policy is gone.
    - product_reviews columns: `user_id` is nullable, `reviewer_email` exists.
    - Storage buckets: `admin-uploads` (private), `avatars` (public, NEW), `product-images` (public).
    - products columns: `featured` (NOT NULL default false), `on_sale` (NOT NULL default false). orders.user_id is nullable.
- [x] **Security advisor**: clean for our functions. Only remaining WARNs are platform-level `rls_auto_enable` and the public-bucket-listing on avatars/product-images (deferred to Phase 6). <!-- id: 1c -->
- [ ] **Smoke test from front-end**: place a guest order (Phase 3 dependency — `useCreateOrder` rewrite required first). <!-- id: 1d -->
- [ ] **Smoke test**: insert a `product_review` row via SQL Editor with `user_id = null, user_name = 'Test Guest', reviewer_email = 'test@example.com'`. Re-run with same `(product_id, reviewer_email)` — should fail unique index. <!-- id: 1e -->
- [ ] **Smoke test**: try to UPDATE a profile's `id` via SQL Editor as service role — trigger should raise `profiles.id is immutable`. <!-- id: 1f -->

> ⚠️ **Phase 3 dependency:** the new `product_reviews` INSERT policy requires `user_name`. Until `useAddReview` (Phase 3, id 15) is updated to capture and pass it, signed-out review submissions from the front-end will be rejected. Do not delay Phase 3.

> 📌 **Project state on 2026-04-28**: 15 tables, all RLS enabled. 1 row in `site_content` (the seeded "deals" banner). 0 rows everywhere else. No admin user exists yet — first super_admin must be created manually via Supabase Auth Studio + `INSERT INTO admin_users (id, email, role, is_active) VALUES (...)` before Phase 2 admin-auth work can be tested.

---

## Phase 2: Admin Auth Migration (Supabase-backed)

**Status:** ✅ **APPLIED** on 2026-04-29. Math.random IDs gone; admin sessions are now real Supabase sessions backed by `admin_users`. First super_admin (`atilla00@hotmail.com`, id `6ab45d48-b15a-4a28-8560-969607f11fa5`) provisioned. 6/6 store tests green.

- [x] **`adminStore` rewrite** (`src/lib/adminStore.ts`) <!-- id: 8 -->
    - [x] Dropped the local `token` field. State is now: `{ user, role, isAuthenticated, isLoading, error }`.
    - [x] `login(email, password)`: calls `supabase.auth.signInWithPassword`, then fetches `admin_users` row by `auth.uid()`. Rejects if no row, `is_active = false`, or role is missing.
    - [x] `logout()`: calls `supabase.auth.signOut()` and clears store.
    - [x] Persist only `{ user.id, role }` (via `partialize`) — the source of truth is the server; persistence is for fast guard render only.
    - [x] Added `refreshFromSession()` for AdminAuthHandler / ProtectedAdminRoute to re-validate from the DB.
- [x] **`AdminAuthHandler` component** (`src/components/AdminAuthHandler.tsx`) <!-- id: 9 -->
    - [x] Listens to `onAuthStateChange`; on SIGNED_IN / TOKEN_REFRESHED / USER_UPDATED, re-fetches `admin_users` via `refreshFromSession`.
    - [x] On SIGNED_OUT, clears the admin store.
    - [x] Mounted only on `/admin/login` and inside `/admin/*` (not on customer routes).
- [x] **`ProtectedAdminRoute` hardening** (`src/components/ProtectedAdminRoute.tsx`) <!-- id: 10 -->
    - [x] On every mount + path change, awaits a server re-check of `admin_users` (does NOT trust local cache for auth decisions).
    - [x] Shows a loading skeleton ("Verifying admin access…") while re-checking.
    - [x] On `is_active = false` or missing row, calls `signOut()` and redirects to `/admin/login`.
    - [x] Honors optional `requiredRole` via a numeric rank (`viewer < editor < super_admin`).
- [x] **Admin login page** (`src/pages/admin/AdminLogin.tsx`) <!-- id: 11 -->
    - [x] Now delegates to `useAdminStore.login(email, password)`. Errors are surfaced via the store's typed `{ ok, error }` return.
- [x] **Disallow admin signup from public AuthModal** <!-- id: 12 -->
    - [x] `/admin/login` exposes no signup CTA — admins are provisioned via DB only.
- [x] **Migration of existing admin** <!-- id: 13 -->
    - [x] `docs/admin-guide.md` rewritten with the manual provisioning steps + SQL snippet at the top.

---

## Phase 3: API Layer Hardening

**Status:** ✅ **APPLIED** on 2026-04-29. New Postgres `create_order(payload jsonb)` RPC enforces RLS server-side; APIs throw structured errors instead of silently returning empty arrays.

Migrations:
- `apply_migration: implementation_16_create_order_rpc` — added the transactional `create_order` RPC, granted EXECUTE to anon + authenticated, revoked from PUBLIC.

- [x] **`orderAPI.ts` — `useCreateOrder`** <!-- id: 14 -->
    - [x] Resolves `user_id` from `supabase.auth.getSession()`; never trusts a caller-supplied `user_id`.
    - [x] Validates `customer_email + customer_name + shipping_address + items` client-side.
    - [x] Wraps the order + items inserts in `public.create_order(payload jsonb)` for an all-or-nothing transaction.
    - [x] Throws via `mapSupabaseError`; no silent empty-array fallbacks.
    - [x] `useUserOrders` now also matches by `user_id = auth.uid()` (so authed users see orders that linked back to them, not only by email).
- [x] **`reviewAPI.ts` — `useAddReview`** <!-- id: 15 -->
    - [x] New `AddReviewInput` shape: `{ product_id, rating, comment, reviewer_name, reviewer_email? }`.
    - [x] Resolves `user_id` from session; else requires `reviewer_email`.
    - [x] Optimistic update + rollback wired via `onMutate` / `onError`.
    - [x] `ReviewSection.tsx` updated to render the guest "name + email" form when not authenticated.
- [x] **`profileAPI.ts`** <!-- id: 16 -->
    - [x] `useUpdateProfile` runs every payload through `sanitizeProfileUpdate`, dropping anything outside `{ full_name, avatar_url, phone, address }`.
- [x] **`wishlistAPI.ts` — sync semantics** <!-- id: 17 -->
    - [x] On login, `syncWishlist` upserts local items (idempotent via the unique constraint) then refetches the server list — net effect = union with server-side rows winning on conflict.
    - [x] `getWishlist` now best-effort deletes orphan rows (where the product was deleted) and surfaces a single `toast.info` "X items removed (no longer available)".
- [x] **Error normalization helper** (`src/lib/apiErrors.ts`, new) <!-- id: 18 -->
    - [x] `mapSupabaseError(err)` returns a typed `ApiError { code, message, details? }` covering Postgres codes (23505 conflict, 42501 forbidden, PGRST301/116, etc.).
    - [x] Wired through `orderAPI`, `reviewAPI`, `profileAPI`, `wishlistAPI`.

---

## Phase 4: Mock Data Retirement

**Status:** ✅ **APPLIED** on 2026-04-29. `src/data/mock.ts` and the entire `src/data/` directory deleted; every public surface now reads from Supabase. `tsc --noEmit` clean.

Migrations:
- `apply_migration: implementation_16_articles_table` — `articles` table, public read for `is_published = true`, admin write, with the `set_articles_updated_at` trigger.

- [x] **Index page (home)** (`src/pages/Index.tsx`) <!-- id: 19 -->
    - [x] Categories rendered from `useCategories(true)`.
    - [x] Carousels driven by `useProducts({ on_sale: true, limit: 10 })` and `useProducts({ featured: true, limit: 10 })`.
    - [x] `useProducts` extended with `featured`, `on_sale`, and `limit` filters.
- [x] **Navbar search** (`src/components/Navbar.tsx`) <!-- id: 20 -->
    - [x] 300ms debounce on the input → `useProducts({ search, is_active: true, limit: 5 })`.
    - [x] Popover renders product images via the `product_images` join, falling back to a placeholder.
- [x] **`BestSellersCarousel.tsx` & `DealsCarousel.tsx`** <!-- id: 21 -->
    - [x] Both now import `Product` from `@/types/product`. No mock import.
- [x] **`Profile.tsx`** <!-- id: 22 -->
    - [x] User reviews fetched via new `useUserReviews(user.id)` (`reviewAPI.ts`). Mock `products.flatMap` lookup deleted.
    - [x] Wishlist + order history sourced live.
- [x] **`Learn.tsx`** <!-- id: 23 -->
    - [x] New `articles` table + `articleAPI.ts` (`useArticles`).
    - [x] Page renders Supabase-backed articles with skeletons + empty state.
- [x] **`Instruments.tsx`, `Brands.tsx`, `Deals.tsx`, `Contact.tsx`, `FAQs.tsx`** <!-- id: 24 -->
    - [x] Already on Supabase; verified — `Instruments` uses `useCategories(true)`, `Brands` uses `useBrands(true)`, `Deals` now uses `useProducts({ on_sale: true, is_active: true })`, `FAQs` uses `faqAPI.getActive()`.
- [x] **Type cleanup** <!-- id: 25 -->
    - [x] All `Product | MockProduct` unions in `src/lib/store.ts` and `src/lib/wishlistAPI.ts` collapsed to `Product`.
    - [x] `Product` type extended with `featured: boolean` and `on_sale: boolean`.
- [x] **Final delete** <!-- id: 26 -->
    - [x] `grep -rn "from '@/data/mock'"` returns zero results across `src/`.
    - [x] `src/data/mock.ts` and `src/data/` removed.
    - [x] Test fixtures in `src/test/store.test.ts` rewritten against the canonical `Product` shape.

---

## Phase 5: UX Gaps

**Status:** ✅ **APPLIED** on 2026-04-29.

- [x] **Password reset route** <!-- id: 27 -->
    - [x] New `src/pages/ResetPassword.tsx` listens for `PASSWORD_RECOVERY` and calls `supabase.auth.updateUser({ password })`.
    - [x] `/reset-password` route added in `App.tsx`.
    - [x] `AuthModal.resetPasswordForEmail` already redirects to `${window.location.origin}/reset-password`.
- [x] **Email confirmation handling** <!-- id: 28 -->
    - [x] If `signUp` returns no session, `AuthModal` switches to a `check-email` view with a "We sent a confirmation link to ..." message and a back-to-sign-in button.
- [x] **Toast standardization** <!-- id: 29 -->
    - [x] Removed shadcn `<Toaster />` from `App.tsx`.
    - [x] Deleted `src/components/ui/toaster.tsx`, `toast.tsx`, `use-toast.ts`, and the `src/hooks/use-toast.ts` hook. Sonner is the only toast in the tree now.
- [x] **Supabase client config** (`src/lib/supabaseClient.ts`) <!-- id: 30 -->
    - [x] `autoRefreshToken`, `persistSession`, `detectSessionInUrl` set explicitly. Local-storage backed.

---

## Phase 6: Storage & Image Uploads

**Status:** ✅ **APPLIED** on 2026-04-29.

- [x] **Verify upload auth** (`src/lib/imageUploader.ts`) <!-- id: 31 -->
    - [x] `requireSession()` and `requireActiveAdmin()` helpers reject unauthenticated / non-admin uploads before hitting storage.
    - [x] `uploadImage` to `product-images` / `admin-uploads` now requires an active admin row; other buckets only require a signed-in session.
- [x] **Avatar uploads** <!-- id: 32 -->
    - [x] New `uploadAvatar(userId, file)` writes to `avatars/<user-id>/<uuid>.<ext>` (matches the user-scoped storage RLS from Phase 1).
    - [x] Profile page avatar widget: clickable circle that opens a file picker, uploads, and patches `profiles.avatar_url`.

---

## Phase 7: Realtime Subscription Scoping

**Status:** ✅ **APPLIED** on 2026-04-29.

- [x] **Split subscriptions by route** (`src/hooks/useRealTimeSubscriptions.ts`) <!-- id: 33 -->
    - [x] Public hook now only watches `products`, `categories`, `brands`, all filtered to `is_active=eq.true` so admin scratch edits don't churn customer caches.
    - [x] New `src/hooks/useAdminRealTimeSubscriptions.ts` watches `orders`, `products` (low-stock UPDATEs), and `inventory_logs`. Mounted from `AdminLayout` (only inside the protected admin tree).
    - [x] Admin hook short-circuits if `useAdminStore.isAuthenticated` is false.
- [x] **Suppress low-stock toasts for non-admins** <!-- id: 34 -->
    - [x] Low-stock toast and "New order received" toast moved into the admin hook — non-admin sessions never run those listeners.

---

## Phase 8: Tooling Cleanup

**Status:** ✅ **APPLIED** on 2026-04-29.

- [x] **Lockfile** <!-- id: 35 -->
    - [x] `bun.lockb` deleted; added to `.gitignore`.
    - [x] `engines: { "node": ">=18", "npm": ">=10" }` added to `package.json`.
- [x] **TypeScript strict mode** <!-- id: 36 -->
    - [x] `strict: true`, `noImplicitAny: true`, `strictNullChecks: true` enabled in `tsconfig.app.json`.
    - [x] Ran `tsc --noEmit` — only 11 errors (not the 50–150 estimate). All fixed:
        - `Category.parent_id` extended to `string | null` (form uses `null` for "no parent").
        - `AdminCategoryList`'s `disabled={…}` coerced via `!!`.
        - Implicit-any params in `ProductCard.tsx` and `productAPI.ts` annotated.
- [x] **ESLint** (`eslint.config.js`) <!-- id: 37 -->
    - [x] `@typescript-eslint/no-unused-vars` set to `warn` with `_`-prefix bypass for intentional unused.
    - [x] `import/order` deferred — was a low-value churn given strict mode + lint-on-CI already gates regressions.
- [x] **Diagnostic scripts** <!-- id: 38 -->
    - [x] All 9 scripts moved to `scripts/diagnostics/`.
    - [x] Added `scripts/diagnostics/README.md` documenting purpose, env vars, and the service-role-key warning for `testService.js`.
- [x] **CI** <!-- id: 39 -->
    - [x] `.github/workflows/ci.yml` runs `npm ci`, `npm run lint`, `npm test`, `npm run build` on pushes to main and PRs (Node 20, working-directory `Music-Ecommerce`). Build receives `VITE_SUPABASE_*` from secrets.

---

## Phase 9: Test Coverage Expansion

**Status:** ✅ **APPLIED** on 2026-04-29. 13 test files / 55 tests, all green.

- [x] **`src/test/orderAPI.test.ts`** <!-- id: 40 -->
    - [x] 5 cases: signed-in user_id passthrough, guest user_id=null, empty cart rejection, blank email rejection, Postgres error mapping (42501 → forbidden).
- [x] **`src/test/profileAPI.test.ts`** <!-- id: 41 -->
    - [x] Sanitization test: drops `id`, `role`, `email` from a malicious payload before reaching Supabase. Auth-required test: throws when `auth.getUser()` returns null.
- [x] **`src/test/checkout.test.tsx`** <!-- id: 42 -->
    - [x] Component test: empty-cart redirect to `/shop`, full shipping → payment → review → place-order flow lands on `/checkout/success`.
- [x] **`src/test/AppAuthHandler.test.tsx`** <!-- id: 43 -->
    - [x] Verifies initial session → setUser + fetchWishlist, SIGNED_OUT → clearWishlist, SIGNED_IN → syncWishlist.
- [x] **`src/test/protectedAdminRoute.test.tsx`** <!-- id: 44 -->
    - [x] 5 cases: loading state, no-session redirect, missing admin row → signOut + redirect, inactive admin redirect, active admin renders children.
- [x] **`src/test/realtime.test.ts`** <!-- id: 45 -->
    - [x] Mocks the Supabase channel; verifies products/categories handlers invalidate the matching React Query keys.
- [x] **Coverage config** <!-- id: 46 -->
    - [x] `vitest.config.ts` adds v8 provider + `text/html/lcov` reporters + 60% threshold on lines/functions/statements (50% branches).
    - [x] Pre-existing `productSchema` test was failing because the schema used `min(0)` instead of `min(1, "At least one image is required")` — fixed.

---

## Phase 10: Verification (close out IMPL_14, IMPL_15, IMPL_16)

**Status:** ⏳ **AUTOMATED CHECKS GREEN; MANUAL SMOKE TESTS PENDING USER**.

### Automated (run on 2026-04-29)
- [x] `npm test` → 13 files / 55 tests passing. <!-- id: 61a -->
- [x] `npx tsc --noEmit -p tsconfig.app.json` → strict mode, 0 errors. <!-- id: 61b -->
- [x] `npm run build` → Vite production build succeeds (terser added as dev dep). <!-- id: 61c -->
- [x] `grep -rn "from '@/data/mock'" src/` returns empty. <!-- id: 62 -->

### Supabase advisor (security)
The following warnings are intentional or platform-managed and documented here:

| Warning | Status |
|---------|--------|
| `public_bucket_allows_listing` for `avatars` + `product-images` | **Intentional.** Both buckets are public so direct URLs work without signed tokens. Listing is a minor leak (filenames are random UUIDs), and locking it down requires switching to signed URLs end-to-end which is out of scope. |
| `anon_security_definer_function_executable` for `create_order` | **Intentional.** `create_order` is callable by anon (for guest checkout) AND authenticated; it re-implements the orders INSERT RLS rule in plpgsql so the SECURITY DEFINER context is safe. |
| `anon_security_definer_function_executable` for `rls_auto_enable` | **Platform-managed.** Supabase's auto-RLS event trigger function — cannot be revoked by us. |
| `auth_leaked_password_protection` | **Dashboard setting.** Toggle on at Supabase Dashboard → Auth → Providers → Password to require HaveIBeenPwned check. Recommended but not required to ship. |

### Manual smoke tests (require browser at http://localhost:5180)

#### IMPL_14 leftovers
- [ ] **Registration test**: Sign up new user → verify rows in `auth.users` AND `public.profiles`. Result: ___ <!-- id: 47 -->
- [ ] **Persistence test**: Hard refresh while signed in → still signed in. Result: ___ <!-- id: 48 -->
- [ ] **Cross-device wishlist sync**: Add on Device A → log in on Device B → present. Result: ___ <!-- id: 49 -->

#### IMPL_15 leftovers
- [ ] **Guest favorite test**: Add to wishlist signed-out → persists in localStorage. Result: ___ <!-- id: 50 -->
- [ ] **Sync test**: Sign in → guest items merge into Supabase. Result: ___ <!-- id: 51 -->
- [ ] **Error test**: Try to favorite a non-existent product → user-visible error. Result: ___ <!-- id: 52 -->
- [ ] **Persistence test**: Real product favorited → persists across sessions. Result: ___ <!-- id: 53 -->

#### IMPL_16 manual checks
- [ ] **Guest checkout**: Place an order without signing in → row in `orders` with `user_id IS NULL`. Result: ___ <!-- id: 54 -->
- [ ] **Authed checkout**: Place an order signed in → row in `orders` with `user_id = auth.uid()`. Result: ___ <!-- id: 55 -->
- [ ] **Anonymous review**: Submit review signed out with name + email → row in `product_reviews` with `user_id IS NULL` and `reviewer_email` populated. Result: ___ <!-- id: 56 -->
- [ ] **Admin escalation probe**: Edit `localStorage` to set role=`super_admin` while logged in as viewer → access denied on every admin route on next mount (because `ProtectedAdminRoute` re-fetches the role). Result: ___ <!-- id: 57 -->
- [ ] **Storage RLS probe**: Anon upload to `product-images` → 403. Editor admin upload → 200. Result: ___ <!-- id: 58 -->
- [ ] **Avatar upload**: Click avatar in profile → choose image → uploads to `avatars/<user-id>/...` and the avatar updates. Cross-user upload (changing the URL path to another user) → 403. Result: ___ <!-- id: 58a -->
- [ ] **Reset password**: From AuthModal "forgot password" → email link → `/reset-password` → set new password → signed in. Result: ___ <!-- id: 59 -->
- [ ] **Email confirmation flow** (if enabled): Sign up → "Check your email" view shown in AuthModal → click link → signed in. Result: ___ <!-- id: 60 -->

---

## Recommended execution order

1. **Phase 1** (DB) — blocks everything else.
2. **Phase 2** (Admin auth) — needed before Phase 6 (uploads).
3. **Phase 3** (API hardening) — depends on Phase 1.
4. **Phase 5** (UX gaps) — independent, can be parallel with 3.
5. **Phase 4** (Mock retirement) — depends on Phase 3 stability.
6. **Phase 6** (Storage) — depends on Phase 2.
7. **Phase 7** (Realtime) — independent.
8. **Phase 8** (Tooling) — partly independent; TS strict (Phase 8.2) is best done last to avoid churning the cascade.
9. **Phase 9** (Tests) — write alongside each phase, batch-finalize at the end.
10. **Phase 10** (Verification) — final gate.
