# Admin User Guide

## Provisioning the first super_admin

Admins are NOT created via the public sign-up form. The first super_admin (and any subsequent admins) must be provisioned through Supabase directly:

1. **Create the auth user** in Supabase Studio → Authentication → Users → "Create a new user". Set email and a strong password. Auto-confirm the email.
2. **Insert the admin row** in the SQL editor:
   ```sql
   insert into public.admin_users (id, email, role, is_active)
   values (
     '<auth-user-uuid>'::uuid,
     '<email>',
     'super_admin', -- or 'editor' / 'viewer'
     true
   );
   ```
3. **Test the login** by signing in at `/admin/login`. The login flow will:
   - Authenticate against Supabase Auth (`signInWithPassword`).
   - Fetch the matching `admin_users` row by `auth.uid()`.
   - Reject the session if the row is missing or `is_active = false`.

To deactivate an admin, set `is_active = false` — they are immediately denied on the next protected-route mount because `ProtectedAdminRoute` re-validates against the server every time.

## Accessing the Admin Panel

- Navigate to `/admin` on your browser.
- Log in using your admin credentials.
- Sessions persist across reloads via Supabase's `localStorage` token store, but each protected route re-checks the role from the server.

## Modules

### Dashboard Overview
The main landing page for the admin panel, providing a birds-eye view of:
- Total products and inventory value.
- Recent sales and order metrics.
- Low-stock alerts and highlights.

### Product Management
- **Add Product:** Create new entries for musical instruments with multi-image support.
- **Edit/Delete:** Modify existing product details or remove items from the catalog.
- **Inventory Check:** Update stock levels and manage badges (e.g., "Best Seller").

### Category & Brand Management
- Maintain the store hierarchy and brand associations.
- Assign products to specific categories and ensure proper classification.

### Order Management
- Monitor incoming orders and track their statuses.
- Update order statuses (e.g., Pending -> Completed).
- View customer information and shipping details.

### Analytics and Reporting
- Export sales and inventory data in CSV/PDF format.
- Visualize performance through interactive charts and graphs.

### System Settings
- Configure global store information.
- Manage branding and shipping preferences.

## Roles

| Role          | Capabilities                                              |
|---------------|-----------------------------------------------------------|
| `super_admin` | Full access (settings, backup, admin user management)     |
| `editor`      | Product / category / brand / order / discount CRUD        |
| `viewer`      | Read-only dashboards and analytics                        |

`ProtectedAdminRoute` accepts an optional `requiredRole` prop. Routes without the prop allow any authenticated admin; routes with `requiredRole="super_admin"` (e.g. `/admin/settings`, `/admin/backup`) deny editors and viewers.

---

*Note: For professional troubleshooting or data migration, please refer to the technical documentation.*
