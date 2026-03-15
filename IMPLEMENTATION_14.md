# IMPLEMENTATION_14: Supabase Auth & Customer Profiles Integration

This plan implements a robust authentication and profile system for the public pages, addressing session persistence, data integrity, and cross-device synchronization.

## Phase 1: Database Hardening
- [x] **Apply Core Profiles Migration**: Run `20260315_customer_profiles.sql` (COMPLETED). <!-- id: 1 -->
- [x] **Apply Schema Update Migration**: <!-- id: 2 -->
    - [x] Add `user_id` to `public.orders` (COMPLETED).
    - [x] Update `public.product_reviews` (COMPLETED - Mock data cleaned).
    - [x] Create `public.wishlist_items` (COMPLETED).
- [x] **Safe Setup**: Ran `20260315_fix_initial_schema.sql` to ensure foundational consistency (COMPLETED). <!-- id: 3 -->

## Phase 2: Auth Infrastructure
- [x] **Refactor `useAuthStore`**: <!-- id: 4 -->
    - [x] Replace mock login/logout with Supabase session state.
    - [x] Add `error` and `loading` states for auth operations.
- [x] **Implement `AppAuthHandler`**: Create a global component in `App.tsx` that listens to `onAuthStateChange` to keep the store in sync with Supabase. <!-- id: 5 -->

## Phase 3: Signup & Login Flow
- [x] **Update `AuthModal.tsx`**: <!-- id: 6 -->
    - [x] Implement `supabase.auth.signInWithPassword`.
    - [x] Implement `supabase.auth.signUp` with `full_name` metadata.
    - [x] Add "Confirm Password" validation.
    - [x] Handle "Email Confirmation Required" state (if enabled in Supabase).
- [x] **Forgot Password**: Add "Forgot Password" link and modal/section using `supabase.auth.resetPasswordForEmail`. <!-- id: 7 -->

## Phase 4: Wishlist & Data Sync
- [x] **Wishlist Persistence**: <!-- id: 8 -->
    - [x] Update `useWishlistStore` to sync local items to Supabase when the user logs in.
    - [x] Fetch server-side wishlist on mount if authenticated.
- [x] **Update APIs**: <!-- id: 9 -->
    - [x] Modify `orderAPI.ts` to include `user_id` in new orders.
    - [x] Modify `reviewAPI.ts` to use UUIDs for review authorship.

## Phase 5: Profile & Personalization
- [ ] **Enhanced Profile Page**: <!-- id: 10 -->
    - [ ] Fetch and display full profile data (address, phone, etc.).
    - [ ] Allow users to edit their profile details.
- [ ] **UI Polish**: Add loading skeletons for profile data and order history. <!-- id: 11 -->

## Phase 6: Verification
- [ ] **Registration Test**: Verify record creation in `auth.users` and `public.profiles`. <!-- id: 12 -->
- [ ] **Persistence Test**: Confirm user remains logged in after hard refresh. <!-- id: 13 -->
- [ ] **Cross-Device Test**: Add item to wishlist on Device A, verify appearance on Device B after login. <!-- id: 14 -->
- [ ] **Security (RLS) Test**: Ensure users cannot view/edit other users' profiles or orders. <!-- id: 15 -->
