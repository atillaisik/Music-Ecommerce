# IMPLEMENTATION_3: Commerce Completion & Professional Polish

This plan transition ARASOUNDS from a product catalog to a functional ecommerce experience with a simulated checkout and professional features.

## 1. Simulated Checkout & Payments
Create a seamless flow to "purchase" instruments without a real credit card.

- [x] **Checkout Page**: New route `/checkout` with a multi-step form (Shipping -> Payment -> Review).
- [x] **Simulated Payment Gateway**: A mock payment processor that validates "test card" numbers and simulates a 2-second processing delay.
- [x] **Order Confirmation**: A success page `/checkout/success` displaying a mock Order ID and summary.
- [x] **Cart Clearing**: Ensure the cart state is cleared upon successful "payment."

## 2. User Accounts & Favorites
Building loyalty and persistence for return customers.

- [x] **Authentication UI**: Simple Login/Sign-up modals or pages (using a mock auth service for now).
- [x] **Wishlist Logic**: Add a "Heart" icon to product cards and a global state to track favorite items.
- [x] **Account Dashboard**: A `/profile` page to view "Recent Orders" and "My Wishlist."


## 3. Product Trust & Discovery
Adding social proof and making products easier to find.

- [x] **Reviews & Ratings**: Add a dedicated section on the `ProductDetail` page for user reviews (mock data).
- [x] **Live Search Autocomplete**: Update `Navbar.tsx` so the search bar shows immediate product results as the user types.

## 4. Professional UX Enhancements
Giving the site a "premium" feel.

- [x] **Dark Mode Support**: Implement a theme toggle using `next-themes` or a custom CSS variable system.
- [x] **Skeleton Loaders**: Add loading skeletons for `ProductCard` and `ProductDetail` to handle "slow" data fetching states gracefully.
- [x] **SEO & Meta Tags**: Integrate `react-helmet-async` to provide unique titles and descriptions for every product page.

## Verification Plan

### Manual Verification
- [x] **Full Flow**: Add item -> Checkout -> Enter fake card -> Verify success message and empty cart.
- [x] **Persistence**: Log in, add to wishlist, refresh, and verify the item is still there.
- [x] **Theme Check**: Toggle dark mode and verify all components (Navbar, Footer, Cards) adapt correctly.
- [x] **Search Logic**: Use the live search to find a specific bass guitar and click the result.
