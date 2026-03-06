# IMPLEMENTATION_11 — Product Media & Shop Fix

## Overview

This implementation fixes 6 interconnected bugs that cause product images not to show on the admin edit page, and real products not to appear correctly on the public-facing shop/detail pages. All issues are fully investigated against the codebase and Supabase schema.

---

## Root Cause Summary

| # | Issue | File(s) Affected | Severity |
|---|-------|-----------------|----------|
| 1 | `ProductForm` `defaultValues` / `form.reset()` timing bug | `ProductForm.tsx` | 🔴 Critical |
| 2 | `useUpdateProduct` delete-all images before re-inserting (data loss on save) | `productAPI.ts` | 🔴 Critical |
| 3 | **`ProductDetail.tsx` reads from mock data** — real products never load | `ProductDetail.tsx`, `ProductImageCarousel.tsx` | 🔴 Critical |
| 4 | RLS `product_images` write policy — admin must be in `admin_users` table | `productAPI.ts` (+ Supabase policies) | 🟡 Important |
| 5 | Zod `images.min(1)` blocks saving a product with zero images | `schemas.ts` | 🟡 Important |
| 6 | `useEffect([initialData])` dep fires on every refetch, wiping unsaved changes | `ProductForm.tsx` | 🟡 Important |

---

## Detailed Analysis

### Issue 1 — `defaultValues` vs `form.reset()`

`react-hook-form` stores `defaultValues` once at mount time. Although `AdminEditProduct.tsx` already guards rendering with a loading spinner (so `initialData` is defined when `ProductForm` mounts), the images are still empty in practice because:

- On the **very first** mount after the route change, React Query may not yet have cached data → `initialData` comes in as `undefined` briefly before the guard kicks in, or
- More critically, the form's `useFieldArray` internal state doesn't react to external changes after init.

**Fix:** After the `useFieldArray` hook, add a `useEffect` that calls `form.reset()` **once** when `initialData?.id` first becomes available (dependency on `initialData?.id`, not the whole object, to avoid firing on every refetch).

---

### Issue 2 — Delete-all images before re-insert (data loss)

In `useUpdateProduct` (`productAPI.ts:190–209`), the update always:
1. Deletes ALL rows from `product_images` for that `product_id`
2. Re-inserts whatever is in the form

If images weren't loaded in the form (due to Issue 1), saving the product permanently destroys all images from the database. Even after fixing Issue 1, the delete-all strategy is brittle.

**Fix:** Keep the delete-then-reinsert strategy (it's the simplest correct approach), but it becomes safe once Issue 1 is fixed and images are always loaded into the form first.

---

### Issue 3 — `ProductDetail.tsx` and `ProductImageCarousel.tsx` use mock data

`ProductDetail.tsx` (`/product/:id`) uses `import { products } from "@/data/mock"` and does `products.find(p => p.id === id)`. Real products have UUID IDs that will never match mock IDs `"1"`–`"18"`, so real product detail pages always show "Product not found."

`ProductImageCarousel.tsx` also imports `type { Product } from "@/data/mock"` — this means its `product` prop is typed against the mock type (with `image: string`, `originalPrice`) not the Supabase type (`images: ProductImage[]`, `original_price`). This causes type incompatibility when passing real data.

**Fix:**
- Rewrite `ProductDetail.tsx` to use `useProduct(id)` from `productAPI.ts` instead of mock data.
- Update `ProductImageCarousel.tsx` to accept `Product` from `@/types/product` (the real type).
- Keep the mock data file intact — `Index.tsx`, `Deals.tsx`, etc. still use it and are out of scope for this task.

---

### Issue 4 — Admin write RLS requires `admin_users` table entry

From the migration (`20260303_initial_schema.sql:162–164`):

```sql
create policy "Allow admin write access for product images" on public.product_images
  for all using (exists (
    select 1 from public.admin_users
    where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')
  ));
```

The **public read** policy is correct (`using (true)`) — so image reads work fine for everyone.

The **admin write** policy requires the logged-in user to exist in `admin_users`. If the admin session is not in `admin_users`, image inserts/deletes fail silently. This is the same RLS pattern that caused product deletion issues in a prior session.

**Fix:** No schema change needed — the policy is correct by design. However, add error surfacing in `useCreateProduct` and `useUpdateProduct` for the image insert step, so failures aren't silent. Also verify the admin account being used is seeded in `admin_users`.

---

### Issue 5 — Zod `images.min(1)` blocks saves with zero images

In `schemas.ts:17`:
```ts
images: z.array(...).min(1, 'At least one image is required'),
```

This makes sense for **creating** a new product. But when **editing**, an admin may want to temporarily clear images or save other field changes even if images haven't been re-uploaded yet. With the current schema, saving fails silently (Zod blocks submission before the API is called).

**Fix:** Relax the validation — change `min(1)` to `min(0)` to allow saving without images. The UI can still warn the user ("No images uploaded") without hard-blocking the save.

---

### Issue 6 — `useEffect([initialData])` fires on every refetch

If the dependency is the whole `initialData` object, React Query's new object reference on every fetch will re-trigger `form.reset()`, wiping any edits the user has made in the meantime (e.g., user starts typing a new description, background refetch fires, form resets to the last saved values).

**Fix:** Use `initialData?.id` as the only dependency, so `reset()` only fires once when the product first loads:
```ts
useEffect(() => {
    if (!initialData) return;
    form.reset({ ... });
}, [initialData?.id]);  // ← only fires when the product ID first becomes available
```

---

## Implementation Checklist

### Phase 1 — Schema & Validation Fix

- [x] **1.1** In `src/lib/schemas.ts`: change `images: z.array(...).min(1, ...)` to `.min(0)` — allow zero images on edit
- [x] **1.2** Verify the admin account used for testing is present in the `admin_users` table in Supabase (manual check via Supabase dashboard — no code change needed)

---

### Phase 2 — `ProductForm.tsx` Fix (Issues 1 & 6)

- [ ] **2.1** After the `useFieldArray` hook in `ProductForm.tsx`, add a `useEffect` that calls `form.reset()` with all `initialData` values mapped correctly
- [ ] **2.2** Use `[initialData?.id]` as the dependency array (NOT `[initialData]`) to prevent re-firing on every background refetch
- [ ] **2.3** Map `initialData.images` correctly: `img.image_url → url`, `img.is_primary`, `img.display_order`
- [ ] **2.4** Confirm that after the fix, opening the edit page shows existing image thumbnails in the Media section

---

### Phase 3 — `productAPI.ts` Error Surfacing (Issue 2 & 4)

- [ ] **3.1** In `useUpdateProduct`, add explicit error handling/toast for the image delete step (currently errors are thrown but the toast may not show which step failed)
- [ ] **3.2** In `useUpdateProduct`, add explicit error handling/toast for the image re-insert step
- [ ] **3.3** In `useCreateProduct`, add explicit error handling/toast for the image insert step
- [ ] **3.4** Confirm that saving a product with no images (after schema fix) succeeds without errors

---

### Phase 4 — `ProductDetail.tsx` Real Data Migration (Issue 3)

- [ ] **4.1** Remove `import { products, Review } from "@/data/mock"` from `ProductDetail.tsx`
- [ ] **4.2** Add `import { useProduct } from "@/lib/productAPI"` to `ProductDetail.tsx`
- [ ] **4.3** Replace `const product = products.find(...)` with `const { data: product, isLoading, error } = useProduct(id)`
- [ ] **4.4** Update all references that use mock-specific fields:
  - `product.brand` (string) → `product.brand?.name`
  - `product.category` (string) → `product.category?.name`
  - `product.originalPrice` → `product.original_price`
  - `product.reviews` → `product.reviews_count`
  - `product.image` (single string) → use `product.images` array
  - `product.reviewsData` → remove/replace with real reviews (out of scope, remove mock reviews display for now)
- [ ] **4.5** Update the `images` prop passed to `ProductImageCarousel`: map `product.images` (array of `ProductImage`) to array of `image_url` strings
- [ ] **4.6** Update `relatedProducts` to use a separate `useProducts({ category_id: product.category_id })` query instead of filtering mock array
- [ ] **4.7** Remove mock-data loading spinner (the fake 800ms `setTimeout`) — use real `isLoading` state from `useProduct`
- [ ] **4.8** Update error state: if `error || !product`, show "Product not found" just as before

---

### Phase 5 — `ProductImageCarousel.tsx` Type Fix (Issue 3)

- [ ] **5.1** Change `import type { Product } from "@/data/mock"` to `import type { Product } from "@/types/product"`
- [ ] **5.2** Verify all usages of the `product` prop inside the carousel still work with the real `Product` type (wishlist functions use `product.id` and `product.name` — both exist in the real type ✅)

---

### Phase 6 — Verification

- [ ] **6.1** Open `/admin/products` → click Edit on any product → confirm Media section shows existing image thumbnails
- [ ] **6.2** Click "Update Product" without changes → re-open edit page → confirm images are still present
- [ ] **6.3** Open `/shop` → confirm all active products from Supabase appear in the grid with correct images
- [ ] **6.4** Click any real product card → confirm `/product/:id` loads the real product data (name, price, images, description)
- [ ] **6.5** Confirm "Related Products" section on product detail page shows real related products from Supabase
- [ ] **6.6** Test adding a new product from scratch with images → confirm images appear in edit view and on the shop

---

## Files Changed Summary

| File | Change Type | Reason |
|------|------------|--------|
| `src/lib/schemas.ts` | Modify | Relax `images.min(1)` → `min(0)` |
| `src/components/admin/products/ProductForm.tsx` | Modify | Add `useEffect` + `form.reset()` with `[initialData?.id]` dep |
| `src/lib/productAPI.ts` | Modify | Add per-step error surfacing in create/update image operations |
| `src/pages/ProductDetail.tsx` | Rewrite | Migrate from mock data to `useProduct()` / real Supabase data |
| `src/components/ProductImageCarousel.tsx` | Modify | Update type import from mock to real `Product` type |

---

## Out of Scope (Not Breaking, Keep for Later)

- `Index.tsx`, `Deals.tsx`, `Profile.tsx`, `Navbar.tsx` — still use mock data for featured/homepage products. Leave for a separate migration pass.
- Review system migration — `ReviewSection.tsx` uses mock `Review` type; ProductDetail currently shows mock reviews. Removing mock reviews from ProductDetail is handled above, but the full real-data review system is out of scope.
