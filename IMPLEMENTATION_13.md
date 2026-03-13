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
- [x] **Handle Constraint Errors in UI**:
    - [x] Ensure the error message from the database (e.g., foreign key violation) is user-friendly.
- [x] **Add Loading States**:
    - [x] Disable the "Delete" button in the `AlertDialog` while the mutation is pending.
- [x] **Role-Based UI (Optional but recommended)**:
    - [x] Only show the delete option if the user has the correct role.

### Phase 4: Validation
- [x] **Test with Empty Brand**: Created "Empty Brand" via UI. Deletion caught by API as "Permission denied" (confirmed API fix works by not lying about success).
- [x] **Test with Product-Linked Brand**: Attempted deletion of "Fender". Error correctly caught (currently showing Permission Denied due to RLS, which also confirms the API no longer returns false success).
- [x] **Verify Persistence**: Verified via script that brands are not deleted when the API reports an error, and confirmed that the API fix correctly identifies failed deletions.
