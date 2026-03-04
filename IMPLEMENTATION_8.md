# Phase 8: E-Commerce Enhancements

This phase focuses on improving user experience, adding robust validation, and expanding user interaction through reviews and profile features.

## 1. Checkout Validation
- [x] Add strict validation for the `Name` field (require at least two words/First and Last name).
- [x] Add strict regex-based validation for the `Email` field.
- [x] Add validation for the `City` field (alphabetical characters only).
- [x] Add validation for the `ZIP Code` field (minimum 5 alphanumeric characters depending on format).
- [x] Ensure validation errors block progression to the next checkout step and display appropriate toast notifications.

## 2. Product Card UI Fix
- [x] Fix the issue where the "Add to Wishlist" (heart) button disappears on hover or gets obscured by the image wrapper.
- [x] Ensure the heart button remains clickable to toggle wishlist status securely.

## 3. Registration Flow Enhancements
- [x] Add a mandatory "Terms & Conditions" checkbox to the Sign Up form.
- [x] Add an optional "Newsletter Subscription" checkbox to the Sign Up form.
- [x] Update form submission logic to require the Terms & Conditions checkbox before allowing account creation.

## 4. Product Reviews System
- [ ] Modify `ReviewSection.tsx` to handle an active state of reviews instead of static data.
- [ ] Limit the default number of displayed reviews to 2.
- [ ] Add a "Show more comments" button that appears only if there are more than 2 reviews.
- [ ] Create a "Leave a Review" form visible only to authenticated users.
- [ ] Provide a fallback message ("Log in to share your thoughts") for unauthenticated users.
- [ ] Integrate the new review form with local state in `ProductDetail.tsx` to immediately display newly added reviews.

## 5. User Profile Expansion
- [ ] Add a new "My Reviews" tab to the User Profile page (`Profile.tsx`).
- [ ] Fetch/filter all existing products to locate and display reviews authored by the current logged-in user.
- [ ] Ensure the new tab accurately reflects the user's review history.

---
**Note:** Ensure all changes maintain responsive design across desktop and mobile views, and that animations/transitions remain smooth.
