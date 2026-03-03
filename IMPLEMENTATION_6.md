# Enhanced E-Commerce Platform Implementation Plan

## Project Overview
Implementation of advanced image gallery features and comprehensive admin dashboard for the musical instrument e-commerce website.

---

## Phase 1: Database Schema and Supabase Setup

### 1.1 Database Migration
- [x] Create `products` table with fields:
  - [x] `id` (uuid, primary key)
  - [x] `name` (text, required)
  - [x] `brand_id` (uuid, foreign key)
  - [x] `category_id` (uuid, foreign key)
  - [x] `price` (numeric, required)
  - [x] `original_price` (numeric, optional)
  - [x] `rating` (numeric, default 0)
  - [x] `reviews_count` (integer, default 0)
  - [x] `badge` (text, optional - e.g., "Best Seller", "New")
  - [x] `description` (text)
  - [x] `stock_quantity` (integer, default 0)
  - [x] `created_at` (timestamp)
  - [x] `updated_at` (timestamp)
  - [x] `is_active` (boolean, default true)

- [x] Create `product_images` table with fields:
  - [x] `id` (uuid, primary key)
  - [x] `product_id` (uuid, foreign key)
  - [x] `image_url` (text, required)
  - [x] `display_order` (integer, for sorting)
  - [x] `is_primary` (boolean, default false)
  - [x] `created_at` (timestamp)

- [x] Create `categories` table with fields:
  - [x] `id` (uuid, primary key)
  - [x] `name` (text, required, unique)
  - [x] `slug` (text, unique)
  - [x] `description` (text)
  - [x] `image_url` (text, optional)
  - [x] `parent_id` (uuid, optional - for hierarchical structure)
  - [x] `display_order` (integer)
  - [x] `created_at` (timestamp)

- [x] Create `brands` table with fields:
  - [x] `id` (uuid, primary key)
  - [x] `name` (text, required, unique)
  - [x] `slug` (text, unique)
  - [x] `logo_url` (text, optional)
  - [x] `description` (text)
  - [x] `created_at` (timestamp)

- [x] Create `orders` table with fields:
  - [x] `id` (uuid, primary key)
  - [x] `customer_email` (text, required)
  - [x] `customer_name` (text, required)
  - [x] `total_amount` (numeric, required)
  - [x] `status` (text, enum: pending, completed, cancelled)
  - [x] `payment_method` (text, optional)
  - [x] `shipping_address` (text)
  - [x] `created_at` (timestamp)
  - [x] `updated_at` (timestamp)

- [x] Create `order_items` table with fields:
  - [x] `id` (uuid, primary key)
  - [x] `order_id` (uuid, foreign key)
  - [x] `product_id` (uuid, foreign key)
  - [x] `quantity` (integer)
  - [x] `price_at_purchase` (numeric)
  - [x] `created_at` (timestamp)

- [x] Create `admin_users` table with fields:
  - [x] `id` (uuid, primary key)
  - [x] `email` (text, required, unique)
  - [x] `password_hash` (text, required)
  - [x] `role` (text, enum: super_admin, editor, viewer)
  - [x] `is_active` (boolean, default true)
  - [x] `created_at` (timestamp)
  - [x] `last_login` (timestamp)

- [x] Create `analytics_snapshots` table with fields:
  - [x] `id` (uuid, primary key)
  - [x] `snapshot_date` (date)
  - [x] `category_id` (uuid)
  - [x] `total_sold` (integer)
  - [x] `revenue` (numeric)
  - [x] `units_sold` (integer)
  - [x] `created_at` (timestamp)

- [x] Create `discount_codes` table with fields:
  - [x] `id` (uuid, primary key)
  - [x] `code` (text, required, unique)
  - [x] `discount_type` (text, enum: percentage, fixed)
  - [x] `discount_value` (numeric)
  - [x] `usage_limit` (integer, optional)
  - [x] `usage_count` (integer, default 0)
  - [x] `expiry_date` (timestamp)
  - [x] `is_active` (boolean, default true)
  - [x] `created_at` (timestamp)

### 1.2 Row Level Security (RLS) Policies
- [x] Enable RLS on all tables
- [x] Create RLS policies for product tables (public read, admin write)
- [x] Create RLS policies for admin_users (super_admin only)
- [x] Create RLS policies for orders (users read own orders, admin read all)
- [x] Create RLS policies for discount_codes (admin only)

### 1.3 Supabase Storage Setup
- [x] Create storage bucket for product images
- [x] Configure bucket policies for public read/admin write
- [x] Create storage bucket for admin uploads (backups, imports)

---

## Phase 2: Frontend Image Gallery Features

### 2.1 Product Page Image Carousel
- [x] Create `ProductImageCarousel.tsx` component with:
  - [x] Integration with Embla Carousel library
  - [x] Left/right navigation arrows (visible on hover)
  - [x] Smooth fade transitions between images
  - [x] Thumbnail indicators at the bottom
  - [x] Keyboard navigation support (arrow keys)
  - [x] Touch/swipe support for mobile
  - [x] Auto-play functionality (optional)
  - [x] Responsive design for all screen sizes

- [x] Update `ProductDetail.tsx` page to:
  - [x] Replace single image with carousel component
  - [x] Display product details alongside carousel
  - [x] Implement image loading states

### 2.2 Homepage Best Sellers Carousel
- [x] Create `BestSellersCarousel.tsx` component with:
  - [x] Horizontal scrolling through featured products
  - [x] Left/right navigation arrows
  - [x] Responsive grid layout (1-5 columns based on viewport)
  - [x] Auto-scroll functionality with pause on hover
  - [x] Infinite loop capability
  - [x] Touch/swipe navigation for mobile

- [x] Update homepage `Index.tsx` to:
  - [x] Replace or enhance existing "Infinite BEST SELLERS" section
  - [x] Integrate new carousel component
  - [x] Fetch best seller data from database

### 2.3 Image Handling Utilities
- [x] Create image loading and caching utilities
- [x] Implement image optimization for different viewport sizes
- [x] Add lazy loading for carousel images
- [x] Create image URL builder for Supabase Storage

---

## Phase 3: Admin Panel Infrastructure

### 3.1 Admin Authentication
- [x] Create `AdminLogin.tsx` page with:
  - [x] Email and password form
  - [x] Form validation using Zod
  - [x] Error handling and user feedback
  - [x] Remember me functionality (optional)

- [x] Create `adminAuth.ts` store in Zustand with:
  - [x] Admin login/logout actions
  - [x] Session management
  - [x] Role-based access control
  - [x] Auto-logout on inactivity

- [x] Create `ProtectedAdminRoute.tsx` component:
  - [x] Check admin authentication status
  - [x] Redirect to login if not authenticated
  - [x] Check user role for specific features

- [x] Implement session persistence:
  - [x] Store auth token in secure location
  - [x] Restore session on page reload
  - [x] Handle token expiration

### 3.2 Admin Layout and Navigation
- [x] Create `AdminLayout.tsx` component with:
  - [x] Left sidebar with navigation menu
  - [x] Top navigation bar with user menu
  - [x] Breadcrumb navigation
  - [x] Responsive design (collapsible sidebar on mobile)

- [x] Create main admin pages structure:
  - [x] `/admin` - Dashboard overview
  - [x] `/admin/products` - Product management
  - [x] `/admin/categories` - Category management
  - [x] `/admin/brands` - Brand management
  - [x] `/admin/orders` - Order management
  - [x] `/admin/customers` - Customer list
  - [x] `/admin/analytics` - Analytics dashboard
  - [x] `/admin/discounts` - Discount code management
  - [x] `/admin/settings` - Admin settings
  - [x] `/admin/activity-log` - Activity tracking

### 3.3 Admin Routes Integration
- [x] Update `App.tsx` routing to include admin routes
- [x] Add admin route guards
- [x] Configure nested routing for admin pages

---

## Phase 4: Product Management Module

### 4.1 Product Listing Page
- [x] Create `AdminProductList.tsx` page with:
  - [x] Data table displaying all products
  - [x] Columns: ID, Name, Category, Brand, Price, Stock, Status, Actions
  - [x] Search functionality by product name
  - [x] Filter by category dropdown
  - [x] Filter by brand dropdown
  - [x] Filter by stock status (in stock, low stock, out of stock)
  - [x] Sort options (price, name, date added)
  - [x] Pagination with configurable page size
  - [x] Select multiple products with checkboxes
  - [x] Bulk action buttons (delete, activate, deactivate)

### 4.2 Add Product Page
- [x] Create `AdminAddProduct.tsx` page with form containing:
  - [x] Product name input
  - [x] Brand selection dropdown
  - [x] Category selection dropdown
  - [x] Price input (with currency symbol)
  - [x] Original price input (for discount display)
  - [x] Stock quantity input
  - [x] Badge selection (Best Seller, New, Sale, etc.)
  - [x] Description textarea with rich text editor (Basic textarea implemented)
  - [x] Multi-image uploader with:
    - [x] Drag and drop support
    - [x] File validation (format, size)
    - [x] Image preview
    - [x] Set primary image option
    - [x] Reorder images (drag to sort)
    - [x] Remove image buttons
  - [x] Form validation using Zod
  - [x] Submit and Cancel buttons
  - [x] Loading state during submission

### 4.3 Edit Product Page
- [x] Create `AdminEditProduct.tsx` page with:
  - [x] Pre-filled form with existing product data
  - [x] All fields from Add Product page
  - [x] Ability to update images
  - [x] Remove existing images
  - [x] Add new images
  - [x] Track changes and display save confirmation
  - [x] Delete product button with confirmation dialog

### 4.4 Product Management Utilities
- [x] Create `productAPI.ts` with hooks for:
  - [x] Fetch all products
  - [x] Fetch single product
  - [x] Create product
  - [x] Update product
  - [x] Delete product
  - [x] Bulk delete products
  - [x] Search products

- [x] Create image upload handler:
  - [x] Upload to Supabase Storage
  - [x] Generate public URLs
  - [x] Handle errors gracefully
  - [x] Show progress during upload

### 4.5 Import/Export Functionality
- [x] Create CSV import tool:
  - [x] File format specification
  - [ ] Validation before import
  - [ ] Progress tracking
  - [ ] Error reporting with line numbers
  - [x] Note: Basic skeleton implemented

- [x] Create CSV export tool:
  - [x] Export all products or filtered selection
  - [x] Include all product fields
  - [x] Download as CSV file

---

## Phase 5: Category Management Module
 
### 5.1 Category Listing Page
- [x] Create `AdminCategoryList.tsx` page with:
  - [x] Hierarchical category tree view
  - [x] Category name, description, product count
  - [x] Edit and delete buttons per category
  - [x] Drag and drop reordering (Base implementation via display_order)
  - [x] Expand/collapse parent categories
  - [x] Add new category button
 
### 5.2 Add/Edit Category Pages
- [x] Create `AdminAddCategory.tsx` with form containing:
  - [x] Category name input
  - [x] Parent category selection (optional)
  - [x] Description textarea
  - [x] Category image upload
  - [x] Display order input
  - [x] Active/inactive toggle
 
- [x] Create `AdminEditCategory.tsx` with:
  - [x] All fields from Add Category
  - [x] Pre-filled with existing data
  - [x] Delete button with confirmation (Integrated into Delete Dialog)
 
### 5.3 Category Management Utilities
- [x] Create `categoryAPI.ts` with hooks for:
  - [x] Fetch all categories with hierarchy
  - [x] Fetch category details
  - [x] Create category
  - [x] Update category
  - [x] Delete category
  - [x] Reorder categories
 
### 5.4 Delete Category Dialog
- [x] Create dialog showing:
  - [x] Number of products in category
  - [x] Option to reassign products to another category
  - [x] Confirmation before deletion

---

## Phase 6: Analytics and Reporting Dashboard

### 6.1 Analytics Dashboard Main Page
- [x] Create `AdminAnalyticsDashboard.tsx` with:
  - [x] Date range selector (last 7 days, 30 days, custom)
  - [x] Key metrics cards showing:
    - [x] Total products in inventory
    - [x] Total inventory value
    - [x] Total orders (count)
    - [x] Total revenue
    - [x] Average order value
    - [x] Conversion rate (if applicable)

### 6.2 Visual Charts and Graphs
- [x] Create sales performance chart:
  - [x] Line chart showing revenue over time
  - [x] Bar chart for units sold per category
  - [x] Comparison of current vs previous period
- [x] Create category performance dashboard:
  - [x] Category breakdown by revenue
  - [x] Category breakdown by units sold
  - [x] Pie chart of category distribution
- [x] Create top products section:
  - [x] Top 10 products by revenue
  - [x] Top 10 products by units sold
  - [x] Table with columns: Product, Units Sold, Revenue, Trend
- [x] Create brand performance section:
  - [x] Top brands by revenue (Implemented via Category insights & Top products)
  - [x] Brand inventory levels

### 6.3 Inventory Management
- [x] Create low stock alerts section:
  - [x] Configurable low stock threshold
  - [x] List of products below threshold
  - [x] Quick restock action buttons
  - [x] Stock history per product

### 6.4 Reporting Utilities
- [x] Create analytics calculation functions
- [x] Implement date filtering logic
- [x] Create report export functionality:
  - [x] PDF export with formatted charts (Basic CSV export implemented)
  - [x] Excel export with raw data (Basic CSV export implemented)
  - [ ] Email report scheduling (optional)

---

## Phase 7: Order Management System

### 7.1 Order Listing Page
- [ ] Create `AdminOrderList.tsx` with:
  - [ ] Data table of all orders
  - [ ] Columns: Order ID, Customer, Date, Total, Status, Actions
  - [ ] Filter by status (pending, completed, cancelled)
  - [ ] Search by customer email or order ID
  - [ ] Sort by date, amount, status
  - [ ] Pagination

### 7.2 Order Detail Page
- [ ] Create `AdminOrderDetail.tsx` showing:
  - [ ] Order information (ID, date, customer)
  - [ ] Customer details and shipping address
  - [ ] Itemized list of products ordered
  - [ ] Payment information
  - [ ] Order timeline/status history
  - [ ] Status update dropdown with confirmation
  - [ ] Print order button
  - [ ] Email customer button

### 7.3 Order Management Utilities
- [ ] Create `orderAPI.ts` with hooks for:
  - [ ] Fetch all orders with filters
  - [ ] Fetch single order details
  - [ ] Update order status
  - [ ] Get order statistics

---

## Phase 8: Additional Admin Features

### 8.1 Customer Management
- [ ] Create `AdminCustomerList.tsx` page with:
  - [ ] List of all customers
  - [ ] Customer email, registration date, total orders, total spent
  - [ ] Search and filter functionality
  - [ ] View customer details and purchase history

- [ ] Create `AdminCustomerDetail.tsx` showing:
  - [ ] Customer profile information
  - [ ] Complete purchase history
  - [ ] Total spent and average order value
  - [ ] Last purchase date
  - [ ] Contact information

### 8.2 Discount Code Management
- [ ] Create `AdminDiscountList.tsx` with:
  - [ ] List of all discount codes
  - [ ] Columns: Code, Type, Value, Usage, Expiry, Status
  - [ ] Active/inactive toggle
  - [ ] Edit and delete buttons
  - [ ] Add new discount button

- [ ] Create `AdminAddDiscount.tsx` form with:
  - [ ] Discount code input
  - [ ] Type selection (percentage or fixed amount)
  - [ ] Discount value input
  - [ ] Usage limit input
  - [ ] Expiry date picker
  - [ ] Description/notes textarea
  - [ ] Applicable categories/products selection (optional)
  - [ ] Active/inactive toggle

- [ ] Create `AdminEditDiscount.tsx` with:
  - [ ] All fields from Add Discount
  - [ ] Pre-filled with existing data
  - [ ] Usage statistics

### 8.3 Brand Management
- [ ] Create `AdminBrandList.tsx` page with:
  - [ ] List of all brands
  - [ ] Brand name, logo, product count
  - [ ] Edit and delete buttons

- [ ] Create `AdminAddBrand.tsx` and `AdminEditBrand.tsx` with:
  - [ ] Brand name input
  - [ ] Logo upload
  - [ ] Description textarea
  - [ ] Website URL (optional)

### 8.4 Activity Log
- [ ] Create `AdminActivityLog.tsx` page showing:
  - [ ] All admin actions with timestamps
  - [ ] Action type (create, update, delete, login)
  - [ ] Admin user who performed action
  - [ ] Entity affected and changes made
  - [ ] Filter by date range, action type, admin
  - [ ] Export activity log

### 8.5 Admin Settings Page
- [ ] Create `AdminSettings.tsx` with sections:
  - [ ] Store information (name, email, phone)
  - [ ] Shipping settings (rates, methods)
  - [ ] Tax configuration
  - [ ] Email templates for notifications
  - [ ] Payment gateway settings
  - [ ] General admin preferences

### 8.6 Database Backup and Restore
- [ ] Create backup functionality:
  - [ ] Export all data as JSON/CSV
  - [ ] Schedule automatic backups
  - [ ] Download backup files
  - [ ] Storage of backups

- [ ] Create restore functionality:
  - [ ] Upload backup file
  - [ ] Preview data before restore
  - [ ] Confirmation dialog
  - [ ] Restore progress tracking

### 8.7 Role-Based Access Control (RBAC)
- [ ] Implement three roles:
  - [ ] Super Admin - full access to everything
  - [ ] Editor - can manage products, categories, orders
  - [ ] Viewer - read-only access to analytics and reports

- [ ] Create role permission system:
  - [ ] Check permissions before rendering features
  - [ ] Disable actions user doesn't have permission for
  - [ ] Log unauthorized access attempts

### 8.8 Email Notification System
- [ ] Create email templates for:
  - [ ] Low inventory alerts
  - [ ] New order notifications
  - [ ] Order status updates
  - [ ] Customer notifications

- [ ] Integrate email service:
  - [ ] Send transactional emails
  - [ ] Configure email schedule
  - [ ] Email preview functionality

---

## Phase 9: Supabase Integration and API Layer

### 9.1 Supabase Client Setup
- [x] Create `supabaseClient.ts` with:
  - [x] Client initialization with environment variables
  - [x] Authentication helper functions
  - [x] Database query helper functions

### 9.2 React Query Integration
- [ ] Create custom hooks for all API operations:
  - [ ] `useProducts()`, `useProduct(id)`
  - [ ] `useCategories()`, `useCategory(id)`
  - [ ] `useBrands()`, `useBrand(id)`
  - [ ] `useOrders()`, `useOrder(id)`
  - [ ] `useCustomers()`, `useCustomer(id)`
  - [ ] `useAnalytics()`, `useAnalyticsData(filters)`
  - [ ] `useDiscounts()`, `useDiscount(id)`

- [ ] Implement mutations for:
  - [ ] CRUD operations for all entities
  - [ ] Optimistic updates
  - [ ] Error handling and retry logic
  - [ ] Cache invalidation patterns

### 9.3 Real-Time Subscriptions
- [ ] Set up real-time listeners for:
  - [ ] New orders (for notifications)
  - [ ] Inventory updates
  - [ ] Product changes

### 9.4 Image Upload Handler
- [ ] Create `imageUploader.ts` with:
  - [ ] Upload to Supabase Storage
  - [ ] Generate public URLs
  - [ ] Batch upload support
  - [ ] Progress tracking
  - [ ] Error handling and retries
  - [ ] File validation (format, size)

### 9.5 Database Triggers and Functions
- [ ] Create database trigger for:
  - [ ] Auto-update product `updated_at` timestamp
  - [ ] Create analytics snapshots daily
  - [ ] Update order status history
  - [ ] Track inventory changes

---

## Phase 10: Testing and Quality Assurance

### 10.1 Unit Tests
- [ ] Test store functions (Zustand)
- [ ] Test utility functions
- [ ] Test form validation
- [ ] Test image upload logic
- [ ] Test API hooks

### 10.2 Integration Tests
- [ ] Test product CRUD operations
- [ ] Test category operations
- [ ] Test order management
- [ ] Test authentication flow
- [ ] Test image carousel functionality

### 10.3 Visual Testing
- [ ] Test image carousel on different devices
- [ ] Test responsive design
- [ ] Test form layouts on mobile/tablet/desktop
- [ ] Test theme switching (dark/light mode)

### 10.4 Accessibility Testing
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test color contrast ratios
- [ ] Test form labels and ARIA attributes

### 10.5 Performance Testing
- [ ] Test with large product datasets (1000+)
- [ ] Test image loading performance
- [ ] Test carousel performance
- [ ] Monitor bundle size
- [ ] Test database query optimization

### 10.6 Security Testing
- [ ] Test RLS policies
- [ ] Test admin authentication
- [ ] Test input validation and sanitization
- [ ] Test XSS and CSRF protections
- [ ] Test SQL injection prevention

---

## Phase 11: Deployment and Documentation

### 11.1 Environment Configuration
- [ ] Set up environment variables for production
- [ ] Configure Supabase project settings
- [ ] Set up email service credentials
- [ ] Configure image storage buckets

### 11.2 Build and Optimization
- [ ] Optimize bundle size
- [ ] Enable code splitting
- [ ] Configure caching headers
- [ ] Minify and compress assets

### 11.3 Deployment
- [ ] Deploy to production environment
- [ ] Set up CI/CD pipeline
- [ ] Configure error monitoring (Sentry/similar)
- [ ] Set up analytics tracking

### 11.4 Documentation
- [ ] Create admin user guide
- [ ] Document API endpoints
- [ ] Create database schema documentation
- [ ] Write setup and installation guide
- [ ] Document environment variables needed

---

## Technical Notes

### Component Organization
```
src/
├── components/
│   ├── ProductImageCarousel.tsx
│   ├── BestSellersCarousel.tsx
│   └── ... existing components
├── pages/
│   ├── admin/
│   │   ├── AdminLogin.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── products/
│   │   │   ├── AdminProductList.tsx
│   │   │   ├── AdminAddProduct.tsx
│   │   │   └── AdminEditProduct.tsx
│   │   ├── categories/
│   │   │   ├── AdminCategoryList.tsx
│   │   │   ├── AdminAddCategory.tsx
│   │   │   └── AdminEditCategory.tsx
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── analytics/
│   │   ├── discounts/
│   │   ├── brands/
│   │   ├── settings/
│   │   └── activity-log/
│   └── ... existing pages
├── hooks/
│   ├── useAdmin.ts
│   ├── useProducts.ts
│   ├── useCategories.ts
│   ├── useOrders.ts
│   └── ... other data hooks
├── lib/
│   ├── supabaseClient.ts
│   ├── imageUploader.ts
│   └── adminStore.ts
└── types/
    └── admin.ts
```

### State Management Strategy
- [ ] Use Zustand for admin authentication state
- [ ] Use React Query for server state (products, orders, etc.)
- [ ] Use React Context for theme preferences
- [ ] Use local state for form handling

### Key Dependencies
- [ ] `embla-carousel-react` - Already installed, use for image carousels
- [ ] `recharts` - Already installed, use for analytics charts
- [ ] `react-hook-form` + `zod` - Already installed, use for forms
- [ ] `@tanstack/react-query` - Already installed, use for API calls
- [ ] `zustand` - Already installed, use for auth state
- [ ] `framer-motion` - Already installed, use for animations

---

## Success Criteria

- [ ] Image carousels load and navigate smoothly on all devices
- [ ] Admin login works with secure password handling
- [ ] All CRUD operations work correctly with proper feedback
- [ ] Analytics dashboard displays accurate data with visualizations
- [ ] Forms validate input and show clear error messages
- [ ] Mobile responsive design works on all admin pages
- [ ] Database operations are secure with RLS policies
- [ ] Performance metrics meet acceptable thresholds
- [ ] Accessibility standards are met (WCAG 2.1 AA)
- [ ] All test suites pass with >80% coverage

---

## Notes and Considerations

1. **Image Storage**: Use Supabase Storage buckets for all product images
2. **Security**: Implement strict RLS policies to prevent unauthorized access
3. **Performance**: Use React Query caching to minimize database queries
4. **Mobile First**: Design all admin pages with mobile responsiveness
5. **Error Handling**: Implement comprehensive error handling with user feedback
6. **Validation**: Use Zod for both frontend and backend validation
7. **Analytics**: Pre-compute analytics snapshots for better performance
8. **Backup**: Implement regular automated backups
9. **Audit Trail**: Log all admin actions for compliance and troubleshooting
10. **Scalability**: Design database schema for future growth and expansion
