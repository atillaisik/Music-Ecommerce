# IMPLEMENTATION_12: Banner Update Fix Checklist

This checklist tracks the implementation of fixes for the banner update error on the Deals Management page.

## Phase 1: Database Migrations
- [x] Create and run `20260312_fix_site_content_rls.sql`
    - [x] Add policy to `admin_users` to allow users to read their own record.
    - [x] Update `site_content` policies for full admin access.
- [x] Create and run `20260312_ensure_constraints.sql`
    - [x] Ensure `UNIQUE(page_name, section_name)` constraint exists.

## Phase 2: API Layer Refinement
- [x] Modify `src/lib/siteContentAPI.ts`
    - [x] Refine `updateContent` for better robustness.
    - [x] Remove client-side `updated_at`.
    - [x] Improve error handling and logging.

## Phase 3: UI Enhancements
- [x] Modify `src/pages/admin/marketing/AdminDeals.tsx`
    - [x] Enhance error toast to display actual error messages.

## Phase 4: Verification
- [ ] Manual Verification
    - [ ] Attempt to save the banner in Admin Deals page.
    - [ ] Confirm success toast appears.
    - [ ] Verify changes persist after page refresh.
