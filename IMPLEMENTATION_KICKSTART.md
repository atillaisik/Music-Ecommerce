# IMPLEMENTATION KICKSTART: SOUNDSCAPE Ecommerce

This plan outlines the steps to transform the current SOUNDSCAPE static mockup into a functional ecommerce application. We will focus on establishing the foundation (State, Routing, Logic) before integrating a full backend.

## Proposed Changes

### 1. State Management Foundation
Establish a global state to handle the shopping cart and user sessions.

#### [NEW] [store.ts](file:///Users/atillaisik/CODES/MUSIC-ECOMMERCE/Music-Ecommerce/src/lib/store.ts)
- [x] Implement **Zustand** for lightweight, persistent global state.
- [x] Define `CartItem` type and `CartState` interface.
- [x] Implement actions: `addToCart`, `removeFromCart`, `updateQuantity`, and `clearCart`.

#### [MODIFY] [App.tsx](file:///Users/atillaisik/CODES/MUSIC-ECOMMERCE/Music-Ecommerce/src/App.tsx)
- [x] Re-evaluate provider wrapping for global state if necessary (though Zustand doesn't require it).

---

### 2. Dynamic Routing & Product Details
Enable users to view individual product information.

#### [NEW] [ProductDetail.tsx](file:///Users/atillaisik/CODES/MUSIC-ECOMMERCE/Music-Ecommerce/src/pages/ProductDetail.tsx)
- [x] Create a new page component to display detailed product info, specifications, and a "Related Products" section.
- [x] Use `useParams` from `react-router-dom` to fetch product data from `mock.ts` based on ID.

#### [MODIFY] [App.tsx](file:///Users/atillaisik/CODES/MUSIC-ECOMMERCE/Music-Ecommerce/src/App.tsx)
- [x] Add route: `<Route path="/product/:id" element={<ProductDetail />} />`.

#### [MODIFY] [ProductCard.tsx](file:///Users/atillaisik/CODES/MUSIC-ECOMMERCE/Music-Ecommerce/src/components/ProductCard.tsx)
- [x] Wrap the image and title in a `Link` to the new product detail page.

---

### 3. Shopping Cart Integration (UI/UX)
Connect the visual cart components to the actual state.

#### [NEW] [CartSheet.tsx](file:///Users/atillaisik/CODES/MUSIC-ECOMMERCE/Music-Ecommerce/src/components/CartSheet.tsx)
- [x] A side-drawer component using `shadcn-ui`'s Sheet.
- [x] Display list of `CartItem`s with quantity controls.
- [x] Calculate and show Subtotal, Tax, and Total.

#### [MODIFY] [Navbar.tsx](file:///Users/atillaisik/CODES/MUSIC-ECOMMERCE/Music-Ecommerce/src/components/Navbar.tsx)
- [x] Integrate `CartSheet` trigger into the ShoppingCart icon.
- [x] Update the cart badge count dynamically from the global state.

#### [MODIFY] [ProductCard.tsx](file:///Users/atillaisik/CODES/MUSIC-ECOMMERCE/Music-Ecommerce/src/components/ProductCard.tsx)
- [x] Connect the "Add to Cart" button to the Zustand `addToCart` action.
- [x] Trigger a "Success" toast using `sonner` when an item is added.

---

### 4. Search & Refinement
Make the headers search bar functional.

#### [MODIFY] [Navbar.tsx](file:///Users/atillaisik/CODES/MUSIC-ECOMMERCE/Music-Ecommerce/src/components/Navbar.tsx)
- [x] Implement a search dropdown/modal that filters products in real-time or redirects to the `Shop` page with search queries.
- [x] Added price range filtering and URL-based search to `Shop.tsx`.

---

## Verification Plan

### Automated Tests
- [ ] Run `npm run test` to ensure existing components still render correctly.
- [ ] (Recommended) Add Vitest unit tests for the Zustand store logic.

### Manual Verification
- [ ] **Cart Logic**: Add 3 different items, increase quantity of one, remove another, and verify the badge and total update correctly.
- [ ] **Persistence**: Refresh the browser and verify the cart contents remain.
- [ ] **Navigation**: Click a product card from the home page and verify it lands on the correct dynamic detail page.
- [ ] **Responsiveness**: Verify the `CartSheet` works intuitively on mobile screens.
