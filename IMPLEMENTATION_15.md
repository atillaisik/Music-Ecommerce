# IMPLEMENTATION_15: Fix Wishlist Persistence & Data Integrity

This phase focuses on fixing the issue where favorites are not being persisted for signed-in users due to ID format mismatches and missing async handling.

## Phase 1: Data Strategy & Mock Updates
- [ ] **UUID Transition**: Replace all numeric IDs in `src/data/mock.ts` with valid UUIDs.
- [ ] **Legacy Cleanup**: Add a filter in `useWishlistStore` and `useCartStore` initialization to remove any non-UUID IDs from local storage (to avoid crashes).

## Phase 2: Store & API Hardening
- [ ] **Error Propagation**: Update `useWishlistStore` in `src/lib/store.ts` to `throw` errors from `wishlistAPI` so components can catch them.
- [ ] **Robust Syncing**: Enhance `syncWishlist` to handle failures on individual items (e.g., if a product doesn't exist in the DB) without failing the whole sync.
- [ ] **Optimistic Rollback**: Implement state rollback logic in the store if the backend operation fails.

## Phase 3: UI Enhancement
- [ ] **Async UI**: Update `ProductCard.tsx` to `await` wishlist actions.
- [ ] **Loading States**: Disable the favorite button while an operation is in progress (`isPending`).
- [ ] **Correct Feedback**: Only show success toasts AFTER a successful backend response; show error toasts on failure.

## Phase 4: Verification
- [ ] **Guest Test**: Verify favorites still work locally for non-logged-in users.
- [ ] **Sync Test**: Verify guest favorites sync to Supabase upon login.
- [ ] **Error Test**: Verify an error message appears when trying to favorite a mock product that doesn't exist in the database.
- [ ] **Persistence Test**: Verify products from the Shop page (real data) persist across sessions and page refreshes.
