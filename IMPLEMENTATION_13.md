# IMPLEMENTATION_13: Fix Brand Deletion Issue

This implementation plan focuses on resolving the issue where brands appear to be deleted successfully in the admin panel but remain in the database.

## Problem Analysis
- **Symptom**: User clicks delete, receives "Brand deleted successfully" toast, but the brand is still present after refresh.
- **Potential Cause 1 (RLS Policy)**: The Row Level Security (RLS) policy might be preventing the deletion. Supabase returns a `200 OK` even if zero rows were deleted if the policy `USING` clause doesn't match.
- **Potential Cause 2 (Foreign Key Constraint)**: The brand might have associated products. The database schema has `on delete restrict` for the `brand_id` in the `products` table. If the error isn't caught or reported correctly, it might lead to confusion.
- **Potential Cause 3 (Query Invalidation)**: The React Query cache might not be updating correctly, although the code shows `invalidateQueries` is being called.

## Checklist

### Phase 1: Investigation & Diagnostics
- [ ] **Check Browser Network Tab**: Perform a deletion and inspect the response from the `brands?id=eq...` DELETE request.
    - [ ] Check if the response body contains an error or if it's empty.
    - [ ] Check the HTTP status code.
- [ ] **Verify User Permissions**: 
    - [ ] Check the `admin_users` table in Supabase.
    - [ ] Confirm the current user has `role` set to either `'super_admin'` or `'editor'`.
    - [ ] Confirm `is_active` is `true`.
- [ ] **Check Brand Products**:
    - [ ] Query the `products` table for the specific `brand_id`.
    - [ ] If products exist, the brand cannot be deleted until products are reassigned or removed.

### Phase 2: API Layer Fixes (`src/lib/brandAPI.ts`)
- [ ] **Update `useDeleteBrand` Mutation**:
    - [ ] Request count from Supabase delete: `.delete({ count: 'exact' })`.
    - [ ] Check if `count === 0` and throw a "Permission denied or brand not found" error if so.
    - [ ] Improve error message parsing in `onError`.

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
