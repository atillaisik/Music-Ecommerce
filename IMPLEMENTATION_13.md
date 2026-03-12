# IMPLEMENTATION_13: Fix Brand Deletion Issue

This implementation plan focuses on resolving the issue where brands appear to be deleted successfully in the admin panel but remain in the database.

## Problem Analysis
- **Symptom**: User clicks delete, receives "Brand deleted successfully" toast, but the brand is still present after refresh.
- **Potential Cause 1 (RLS Policy)**: The Row Level Security (RLS) policy might be preventing the deletion. Supabase returns a `200 OK` even if zero rows were deleted if the policy `USING` clause doesn't match.
- **Potential Cause 2 (Foreign Key Constraint)**: The brand might have associated products. The database schema has `on delete restrict` for the `brand_id` in the `products` table. If the error isn't caught or reported correctly, it might lead to confusion.
- **Potential Cause 3 (Query Invalidation)**: The React Query cache might not be updating correctly, although the code shows `invalidateQueries` is being called.

## Checklist

### Phase 1: Investigation & Diagnostics
- [x] **Check Browser Network Tab**: Perform a deletion and inspect the response from the `brands?id=eq...` DELETE request.
    - [x] Check if the response body contains an error or if it's empty. (Confirmed: Returns success with empty error when RLS blocks)
    - [x] Check the HTTP status code. (Confirmed: 204 No Content for success, which PostgREST sends)
- [x] **Verify User Permissions**: 
    - [x] Check the `admin_users` table in Supabase. (Confirmed: RLS requires active admin role)
    - [x] Confirm the current user has `role` set to either `'super_admin'` or `'editor'`.
    - [x] Confirm `is_active` is `true`.
- [x] **Check Brand Products**:
    - [x] Query the `products` table for the specific `brand_id`. (Confirmed: Brands 'Suzuki', 'Fender', 'Example' have products and cannot be deleted)
    - [x] If products exist, the brand cannot be deleted until products are reassigned or removed. (Confirmed: `on delete restrict` is in place)

### Phase 2: API Layer Fixes (`src/lib/brandAPI.ts`)
- [x] **Update `useDeleteBrand` Mutation**:
    - [x] Request count from Supabase delete: `.delete({ count: 'exact' })`.
    - [x] Check if `count === 0` and throw a "Permission denied or brand not found" error if so.
    - [x] Improve error message parsing in `onError`.

### Phase 3: UI Layer Fixes (`src/pages/admin/brands/AdminBrandList.tsx`)
- [ ] **Handle Constraint Errors in UI**:
    - [ ] Ensure the error message from the database (e.g., foreign key violation) is user-friendly.
- [ ] **Add Loading States**:
    - [ ] Disable the "Delete" button in the `AlertDialog` while the mutation is pending.
- [ ] **Role-Based UI (Optional but recommended)**:
    - [ ] Only show the delete option if the user has the correct role.

### Phase 4: Validation
- [ ] **Test with Empty Brand**: Create a new test brand with no products and try deleting it.
- [ ] **Test with Product-Linked Brand**: Try deleting a brand that has products and verify a clear error message is shown.
- [ ] **Verify Persistence**: Confirm the brand is actually gone from the database after a successful deletion.
