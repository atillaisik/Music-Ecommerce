# API Documentation

## Overview

The application interacts with Supabase for data management. API operations are abstracted through custom React Query hooks for efficient data fetching, caching, and state management.

### Products API
- **Hook:** `useProducts()`
  - Fetches all products with filtering options (category, brand, search name).
- **Hook:** `useProduct(id)`
  - Retrieves detailed information for a single product by its UUID.
- **Mutation:** `createProduct(data)`
  - Adds a new product to the database.
- **Mutation:** `updateProduct(id, data)`
  - Modifies existing product attributes.
- **Mutation:** `deleteProduct(id)`
  - Removes a product and its associated image references.

### Categories API
- **Hook:** `useCategories()`
  - Lists all product categories with their hierarchy.
- **Hook:** `useCategory(id)`
  - Fetches category details, including associated product counts.
- **Mutation:** `createCategory(data)`
  - Adds a new category to the store.
- **Mutation:** `updateCategory(id, data)`
  - Edits category metadata (name, description, image).
- **Mutation:** `deleteCategory(id)`
  - Deletes a category (requires reassigning products).

### Brands API
- **Hook:** `useBrands()`
  - Retrieves all brands currently in the system.
- **Hook:** `useBrand(id)`
  - Fetches brand-specific details.

### Orders API
- **Hook:** `useOrders()`
  - Lists all customer orders with filtering (status, date).
- **Hook:** `useOrderStatistics()`
  - Returns aggregated order metrics for the analytics dashboard.
- **Mutation:** `updateOrderStatus(id, status)`
  - Updates the status of a specific order.

### Analytics API
- **Hook:** `useAnalyticsData(filters)`
  - Retrieves pre-computed analytics snapshots based on date ranges.

---

*Note: All API calls require valid Supabase credentials and are subject to Row Level Security (RLS) policies.*
