# IMPLEMENTATION_2: ARASOUNDS Rebranding & UI Enhancements

## Phase 1: Rebranding & General UI Updates
- [x] Rename all "SOUNDSCAPE" or "SoundScape" occurrences to "ARASOUNDS" across the site.
- [x] Update "New Arrivals 2024" to "New Arrivals 2026" in the Hero section (`Index.tsx`).
- [x] Update copyright year in the Footer from "2024" to "2026" (`Footer.tsx`).
- [x] Update contact email domain if necessary (e.g., `hello@arasounds.com`).

## Phase 2: Product Data & Content Fixes
- [ ] Replace broken or missing Bass product images in `mock.ts` with new high-quality URLs.
- [ ] Add 6 additional products to `mock.ts` to support the 10-card Best Sellers showcase.
- [ ] Verify Bass product images are appearing correctly on the `/instruments` and `/shop` pages.

## Phase 3: Dynamic Logic & Brand Filtering
- [ ] Update category product counts to be dynamic (reflecting actual product quantities in each category).
- [ ] Add "Our Brands" section to the Shop sidebar.
- [ ] Implement brand filtering logic in `Shop.tsx` via URL query parameters.
- [ ] Update the "Trusted by Top Brands" section on the homepage to link directly to filtered brand results.
- [ ] Update the `/brands` page and sidebar/homepage brand links to use `?brand=BrandName`.

## Phase 4: Magic UI Marquee Integration
- [ ] Add Magic UI `Marquee` component to the codebase (`src/components/magicui/Marquee.tsx`).
- [ ] Replace the hardcoded "Best Sellers" grid on the homepage with the scrolling Marquee.
- [ ] Configure Marquee behavior: autonomous movement, infinite loop, and `pauseOnHover={true}`.
- [ ] Ensure 10 total product cards are rendered within the Marquee.

## Phase 5: Verification & Testing
- [ ] Cross-browser check for rebranding consistency.
- [ ] Verify brand filtering works correctly from all entry points (Sidebar, Brands Page, Homepage).
- [ ] Confirm Marquee interaction and performance.
