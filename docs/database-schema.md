# Database Schema Documentation

## Database Architecture

The Music-Ecommerce platform uses Supabase (PostgreSQL) as the back-end database provider. All tables are protected using Row Level Security (RLS) policies.

### Tables

#### `products`
The core catalog table for storing musical instrument details.
- `id` (uuid, Primary Key)
- `name` (text)
- `brand_id` (uuid, Foreign Key to brands)
- `category_id` (uuid, Foreign Key to categories)
- `price` (numeric)
- `original_price` (numeric, optional)
- `rating` (numeric, default 0)
- `reviews_count` (integer, default 0)
- `badge` (text, e.g., "Best Seller", "New")
- `description` (text)
- `stock_quantity` (integer, default 0)
- `is_active` (boolean, default true)
- `created_at` (timestamp, default now())
- `updated_at` (timestamp, default now())

#### `product_images`
Stores references to product images in Supabase Storage.
- `id` (uuid, Primary Key)
- `product_id` (uuid, Foreign Key to products)
- `image_url` (text)
- `display_order` (integer)
- `is_primary` (boolean, default false)
- `created_at` (timestamp)

#### `categories`
Hierarchical category structure for product organization.
- `id` (uuid, Primary Key)
- `name` (text, unique)
- `slug` (text, unique)
- `description` (text)
- `image_url` (text, optional)
- `parent_id` (uuid, optional, recursive Foreign Key)
- `display_order` (integer)
- `created_at` (timestamp)

#### `brands`
Information about represented musical instrument brands.
- `id` (uuid, Primary Key)
- `name` (text, unique)
- `slug` (text, unique)
- `logo_url` (text, optional)
- `description` (text)
- `created_at` (timestamp)

#### `orders`
Stores customer orders and transaction history.
- `id` (uuid, Primary Key)
- `customer_email` (text)
- `customer_name` (text)
- `total_amount` (numeric)
- `status` (text, enum: pending, completed, cancelled)
- `payment_method` (text, optional)
- `shipping_address` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `order_items`
Detailed line items for each customer order.
- `id` (uuid, Primary Key)
- `order_id` (uuid, Foreign Key to orders)
- `product_id` (uuid, Foreign Key to products)
- `quantity` (integer)
- `price_at_purchase` (numeric)

#### `analytics_snapshots`
Pre-calculated metrics for dashboard performance optimization.
- `id` (uuid, Primary Key)
- `snapshot_date` (date)
- `category_id` (uuid)
- `total_sold` (integer)
- `revenue` (numeric)

---

### Row Level Security (RLS)

- **Public Access**: Tables such as `products`, `product_images`, `categories`, and `brands` are publicly readable.
- **Admin Access**: Restricted access is enforced for all write operations and sensitive data (e.g., `orders`, `analytics_snapshots`).
- **User Specific**: Individual users may read only their own orders (if auth is fully integrated).

---

*Note: For migrations and real-time triggers, refer to the Supabase dashboard project configuration.*
