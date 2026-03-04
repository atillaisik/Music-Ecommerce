# Phase 9: Admin, UX & Backend Integration Fixes

This phase focuses on fixing persistent admin issues, implementing the CSV import system, cleaning up financial calculations, and enhancing the user profile and social presence.

## 1. Admin UI & Visibility Fixes
- [x] **Category Status**: Fix the toggle button in `AdminCategoryList.tsx` to persist changes in Supabase.
- [x] **Brands Visibility**: Investigate and fix why new brands don't appear in `Our Brands`.
- [x] **Instruments Page**: Ensure new categories appear in the Instruments navigation/grid.
- [x] **Navigation**: Fix the "+ Add Product" button routing in the admin product list.

## 2. Product Management Enhancements
- [x] **CSV Import**: Implement `handleImportCSV` in `AdminProductList.tsx`.
    - [x] Match columns with the existing export function.
    - [x] Implement logic to automatically create missing Brands/Categories.
    - [x] Implement image URL handling for multiple product images.

## 3. Financial & Order Logic
- [x] **Discard Tax**: Completely remove tax logic from `cartStore.ts`, `Checkout.tsx`, and `CartSheet.tsx`.
- [x] **Order Sync**: Debug and fix missing orders in the Admin panel (ensure React Query invalidation or Realtime).

## 4. User Profile & Socials
- [x] **Real Data**: Replace mock "Recent Orders" with real data fetched by `user_id`.
- [x] **Profile Navigation**: Add a `<- Back` button to the `Profile.tsx` page.
- [x] **Review Fix**: Investigate if `user_id` is being recorded during review submission; fix the display count.
- [x] **Contact Page**: 
    - [x] Add TikTok icon and link to the social community section.
    - [x] Set all social icons to redirect to their platforms' homepages.


## 5. Theme & Content
- [x] **Admin Theme**: Integrate the existing light/dark mode switch into the Admin Layout/Header.
- [x] **Dynamic FAQs**: Create a FAQ system that can be managed from the Admin Panel.
- [x] **Deals Carousel**: Add left/right navigation arrows to the Deals section to match the Best Sellers carousel.

## Verification checklist
- [x] **Admin Dashboard**: Verify that the theme toggle correctly switches between light and dark modes.
- [x] **Category Management**: Toggle a category status and refresh the page to ensure it persists.
- [x] **Brand Visibility**: Create a new brand and verify it appears in the "Our Brands" section on the homepage.
- [x] **Instruments Navigation**: Create a new category and verify it appears in the navigation and the instruments grid.
- [x] **CSV Import**: Import a sample CSV and verify that products are created with correct images, brands, and categories.
- [x] **Checkout Flow**: Add items to cart and proceed to checkout; confirm that no tax is calculated or displayed.
- [x] **Order Tracking**: Place an order and verify it immediately appears in both the User Profile and Admin Orders list.
- [x] **User Profile**: Confirm "Recent Orders" shows real transaction history and the "Back" button functions.
- [x] **Reviews**: Submit a review and verify that the author ID is correctly recorded and the review count updates.
- [x] **Contact Page**: Verify the TikTok icon is present and all social links redirect to the correct homepages.
- [x] **FAQs**: Add/edit FAQs in the Admin panel and verify they update on the Contact page.
- [x] **Deals Carousel**: Test the new navigation arrows in the Deals section.
