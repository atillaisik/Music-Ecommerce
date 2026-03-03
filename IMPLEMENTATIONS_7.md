# Phase 7: Product Card Carousel Finalization Plan

This document outlines the decisions and implementation plan for the Product Card image carousel, based on the recent analysis and review.

## 1. Data Models & Type Inconsistency
**Decision:** We are not ready for database transactions or the full Supabase transition yet.
**Plan:** 
- [x] Maintain the current mock data typing (`images?: string[]`) for `ProductCard.tsx`.
- [x] Keep the `types/product.ts` separate for now until we are officially ready to integrate the real backend.
- [x] No type or backend changes will be made in this phase.

## 2. Mobile Experience and Touch Interactions
**Decision:** Prioritize the mobile experience since the majority of users are on phones.
**Plan:** 
- [x] The current manual state-based arrow navigation is not enough for touch devices.
- [x] Implement proper native swiping for the images in `ProductCard.tsx` so users can effortlessly swipe left/right on their phones.

## 3. Image Preloading and Performance
**Decision:** Render images side-by-side for a seamless sliding effect if it isn't too heavy, and skip the manual preloading logic.
**Plan:** 
- [x] Placing images side-by-side (in a flex row with `overflow-hidden`) solves the "blank flash" issue and allows for smooth sliding animations. 
- [x] It will **not** be too heavy for the project because we can still use `loading="lazy"` on those images. The browser will only fetch the image bits shortly before they slide into view.
- [x] Refactor the card image container into a sliding track rather than instantly swapping `src` states.

## 4. Component Duplication
**Decision:** Evaluate current usage: `ProductImageCarousel.tsx` vs. inline carousel in `ProductCard.tsx`. Keep what is used, discard what isn't, but avoid redundant components if they do the same thing.
**Investigation Findings:** 
- [x] Both components are actively used, but for completely different contexts. 
- [x] `ProductImageCarousel.tsx` is used on the **Product Detail Page** (`ProductDetail.tsx`) and is a large, complex component featuring thumbnail image navigation, keyboard controls, and fade effects.
- [x] `ProductCard.tsx` is used on the **Shop & Home Pages** and requires a tiny, inline, thumbnail-less sliding carousel.
- [x] Since both serve completely distinct visual needs, we will **keep both**. We will integrate the lightweight `embla-carousel-react` into `ProductCard.tsx` to handle the side-by-side swiping without bloating it with the thumbnail logic from the detail page component.

## 5. Carousel State Persistence
**Decision:** Leave the carousel on the last picture the user viewed.
**Plan:** 
- [ ] If a user swipes or clicks to the 3rd image and scrolls away, the card will remain on the 3rd image.
- [ ] Do not implement any logic to reset the current image index on `mouseLeave` or blur events.

## 6. Accessibility (a11y) - Added Detail
**Plan:** 
- [ ] Ensure we add dynamic `alt` tags to the images inside the card (e.g., `alt={`${product.name} - Image ${index + 1}`}`) so screen readers can interpret that there are multiple images for the product.

---
### Next Steps
- [ ] Once this plan is approved, we will update `ProductCard.tsx` to incorporate the `embla-carousel-react` library for swipe support and side-by-side rendering. No backend or type transitions will be performed.
