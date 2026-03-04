# Phase 9: Admin, UX & Backend Integration Fixes

This phase focuses on fixing persistent admin issues, implementing the CSV import system, cleaning up financial calculations, and enhancing the user profile and social presence.

## 1. Admin UI & Visibility Fixes
- [x] **Category Status**: Fix the toggle button in `AdminCategoryList.tsx` to persist changes in Supabase.
- [x] **Brands Visibility**: Investigate and fix why new brands don't appear in `Our Brands`.
- [x] **Instruments Page**: Ensure new categories appear in the Instruments navigation/grid.
- [x] **Navigation**: Fix the "+ Add Product" button routing in the admin product list.

## 2. Product Management Enhancements
- [ ] **CSV Import**: Implement `handleImportCSV` in `AdminProductList.tsx`.
    - Match columns with the existing export function.
    - Implement logic to automatically create missing Brands/Categories.
    - Implement image URL handling for multiple product images.

## 3. Financial & Order Logic
- [ ] **Discard Tax**: Completely remove tax logic from `cartStore.ts`, `Checkout.tsx`, and `CartSheet.tsx`.
- [ ] **Order Sync**: Debug and fix missing orders in the Admin panel (ensure React Query invalidation or Realtime).

## 4. User Profile & Socials
- [ ] **Real Data**: Replace mock "Recent Orders" with real data fetched by `user_id`.
- [ ] **Profile Navigation**: Add a `<- Back` button to the `Profile.tsx` page.
- [ ] **Review Fix**: Investigate if `user_id` is being recorded during review submission; fix the display count.
- [ ] **Contact Page**: 
    - Add TikTok icon and link to the social community section.
    - Set all social icons to redirect to their platforms' homepages.

## 5. Theme & Content
- [ ] **Admin Theme**: Integrate the existing light/dark mode switch into the Admin Layout/Header.
- [ ] **Dynamic FAQs**: Create a FAQ system that can be managed from the Admin Panel.
- [ ] **Deals Carousel**: Add left/right navigation arrows to the Deals section to match the Best Sellers carousel.
