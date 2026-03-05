# Phase 10: Bug Fixes & UI Polish

This phase focuses on fixing reported bugs across the admin panel, storefront navigation, and visual consistency issues.

---

## 1. Add Product Page — Blank Screen
**Bug**: Clicking the `+ Add Product` button in the Admin Product List navigates to `/admin/products/add` but the page renders blank/nothing.

**Root cause to investigate**: The `ProductForm.tsx` component (used in `AdminAddProduct.tsx`) likely crashes silently on render — possibly due to a missing required prop, a data-fetch error (e.g., `useCategories` / `useBrands` returning null), or a rendering exception swallowed without an error boundary.

**Files**: 
- `src/pages/admin/products/AdminAddProduct.tsx`
- `src/components/admin/products/ProductForm.tsx`
- `src/lib/productAPI.ts`

**Fix**:
- [x] Inspect `ProductForm.tsx` for any rendering-time crashes or uncaught exceptions.
- [x] Add a null-guard / loading state for `categories` and `brands` data before rendering form selects.
- [x] If the issue is a missing route or lazy-load problem, verify `App.tsx` route for `products/add` resolves correctly.
- [x] Optionally wrap `AdminAddProduct` in a React `ErrorBoundary` for better debugging.

---

## 2. Edit Category — "Update Category" Does Not Persist
**Bug**: Navigating to `/admin/categories/edit/:id` and submitting the form does not update the category in Supabase (no visible change after save).

**Root cause to investigate**: `AdminEditCategory.tsx` calls `useUpdateCategory()` but this hook may have a mismatch between the data shape it sends and what the `category_form` expects, or the Supabase `update()` call silently fails.

**Files**:
- `src/pages/admin/categories/AdminEditCategory.tsx`
- `src/components/admin/categories/CategoryForm.tsx`
- `src/lib/categoryAPI.ts`

**Fix**:
- [x] Inspect `useUpdateCategory` in `categoryAPI.ts` — verify the mutation sends `{ id, data }` and the Supabase `.update(data).eq('id', id)` call is correct.
- [x] Check that `CategoryForm` correctly maps its internal field state back to the `CategoryFormData` shape expected by `onSubmit`.
- [x] Add `toast.error` handling in the `onError` of the mutation if not already present.
- [x] Confirm `queryClient.invalidateQueries` on success re-fetches the updated list.

---

## 3. Category Status Toggle — Visual Redesign
**Request**: The status toggle in the Category table (currently `ToggleLeft`/`ToggleRight` icons) should be redesigned to match the pill badge style used in the **Products** and **Brands** admin lists.

**Reference style** (from `AdminProductList.tsx`):
```tsx
// Active
<div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
  <CheckCircle2 className="h-3 w-3" /> Active
</div>

// Inactive
<div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-500/10 text-slate-600 border border-slate-500/20 text-[10px] font-bold uppercase tracking-wider">
  <XCircle className="h-3 w-3" /> Inactive
</div>
```

**Files**:
- `src/pages/admin/categories/AdminCategoryList.tsx`

**Fix**:
- [x] Replace the `ToggleLeft`/`ToggleRight` button in the Status column with the pill-badge style from `AdminProductList.tsx`.
- [x] Keep the `onClick` handler (`updateCategory.mutate`) intact — just replace the visual element.
- [x] Import `CheckCircle2` and `XCircle` from `lucide-react`.
- [x] **Category Status Toggle — Visual Redesign (Complete)**

---

## 4. Footer "FAQs" Link — Route Fix & New Public FAQ Page
**Bug**: Clicking "FAQs" in the footer's Support column navigates to `/contact` (all support links share the same `/contact` href). It should navigate to a dedicated `/faqs` public-facing page.

**Files**:
- `src/components/Footer.tsx`
- `src/App.tsx`
- New: `src/pages/FAQs.tsx`

**Fix**:
- [ ] In `Footer.tsx`, replace the blanket `to="/contact"` href in the Support list with individual routes:
  - `Contact Us` → `/contact`
  - `FAQs` → `/faqs`
  - `Shipping` → `/contact` (or a future page)
  - `Returns` → `/contact` (or a future page)
- [ ] Create `src/pages/FAQs.tsx` — a public page that:
  - Uses the same `faqAPI.getActive()` call as `Contact.tsx` to fetch dynamic FAQs from Supabase.
  - Renders FAQs in an `Accordion` component (same style as in Contact page).
  - Includes `Navbar` and `Footer`.
  - Has a clean hero section with an `<h1>` and subtitle.
  - Has proper `<Helmet>` SEO tags.
- [ ] Register the new route in `App.tsx`: `<Route path="/faqs" element={<FAQs />} />`.

---

## 5. Admin Settings — Store Identity Not Persisting
**Bug**: Changes made to fields in the "Store Identity" section of Admin Settings (Entity Name, Support Hotline, Email, Address, Brand Mission) are lost on page refresh — all inputs use `defaultValue` (uncontrolled) and `handleSave` only fires a `toast.success` without actually writing to Supabase.

**Files**:
- `src/pages/admin/settings/AdminSettings.tsx`

**Fix**:
- [ ] Create a `store_settings` table in Supabase (or use a `key-value` config table) to hold store identity fields.
  - Suggested columns: `id`, `store_name`, `support_phone`, `support_email`, `address`, `mission_statement`, `updated_at`
- [ ] Create a `settingsAPI.ts` lib file with:
  - `useStoreSettings()` — fetches the single settings row.
  - `useUpdateStoreSettings()` — upserts the settings row.
- [ ] Refactor `AdminSettings.tsx` Store Identity tab:
  - Replace `defaultValue` (uncontrolled) with `value` + `onChange` (controlled state via `useState`, seeded from `useStoreSettings` data).
  - Wire the "Synchronize Settings" button to call `useUpdateStoreSettings().mutate(formState)`.
  - Show a loading spinner while fetching and a success/error toast on save.

---

## 6. Footer Logo — Theme-Aware SVG Logo
**Bug**: In light mode, the footer uses `<img src="/ArasSounds.png" ...>` which renders a static PNG (likely dark/colored) that does not adapt to the light theme. The Navbar already uses the theme-aware `<Logo />` SVG component (which uses `fill="currentColor"` and responds to `text-black dark:text-white`).

**Files**:
- `src/components/Footer.tsx`
- `src/components/ui/Logo.tsx` (no change needed — already theme-aware)

**Fix**:
- [ ] In `Footer.tsx`, replace the `<img src="/ArasSounds.png" ...>` with the `<Logo />` component:
  ```tsx
  import { Logo } from "@/components/ui/Logo";
  // ...
  <Logo className="h-8 w-auto text-black dark:text-white transition-colors duration-300" />
  ```
- [ ] Remove the now-unused `<img>` tag.

---

## Verification Checklist
- [x] **Add Product**: Navigate to `/admin/products/add` and verify the form renders correctly with all fields, dropdowns, and image uploaders.
- [x] **Edit Category**: Edit a category's name/description and confirm the changes persist after refreshing `/admin/categories`.
- [ ] **Category Status Badges**: Confirm the Active/Inactive status in the category list now displays as a pill badge, consistent with Products and Brands.
- [x] **Footer FAQ Link**: Click "FAQs" in the footer and verify it navigates to `/faqs`, not `/contact`.
- [x] **Public FAQ Page**: Verify `/faqs` renders with dynamic FAQs from Supabase, with correct Navbar, Footer, and hero styling.
- [ ] **Store Identity Persistence**: Change and save store settings; refresh the page and confirm the changes are retained.
- [ ] **Footer Logo**: Switch to light mode and confirm the footer logo turns black (matching the header logo).
