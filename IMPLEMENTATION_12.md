# IMPLEMENTATION_12: Banner Update Fix Checklist

This checklist tracks the implementation of fixes for the banner update error on the Deals Management page.

## Phase 1: Database Migrations
- [ ] Create and run `20260312_fix_site_content_rls.sql`
    - [ ] Add policy to `admin_users` to allow users to read their own record.
    - [ ] Update `site_content` policies for full admin access.
- [ ] Create and run `20260312_ensure_constraints.sql`
    - [ ] Ensure `UNIQUE(page_name, section_name)` constraint exists.

## Phase 2: API Layer Refinement
- [ ] Modify `src/lib/siteContentAPI.ts`
    - [ ] Refine `updateContent` for better robustness.
    - [ ] Remove client-side `updated_at`.
    - [ ] Improve error handling and logging.

## Phase 3: UI Enhancements
- [ ] Modify `src/pages/admin/marketing/AdminDeals.tsx`
    - [ ] Enhance error toast to display actual error messages.

## Phase 4: Verification
- [ ] Manual Verification
    - [ ] Attempt to save the banner in Admin Deals page.
    - [ ] Confirm success toast appears.
    - [ ] Verify changes persist after page refresh.
