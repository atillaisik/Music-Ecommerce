-- Initial Database Schema for ARASOUNDS E-Commerce

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Categories Table
create table public.categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    slug text not null unique,
    description text,
    image_url text,
    parent_id uuid references public.categories(id) on delete set null,
    display_order integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 2. Create Brands Table
create table public.brands (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    slug text not null unique,
    logo_url text,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 3. Create Products Table
create table public.products (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    brand_id uuid references public.brands(id) on delete restrict,
    category_id uuid references public.categories(id) on delete restrict,
    price numeric(10, 2) not null check (price >= 0),
    original_price numeric(10, 2) check (original_price >= 0),
    rating numeric(2, 1) default 0 check (rating >= 0 and rating <= 5),
    reviews_count integer default 0 check (reviews_count >= 0),
    badge text, -- e.g., "Best Seller", "New"
    description text,
    stock_quantity integer default 0 check (stock_quantity >= 0),
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 4. Create Product Images Table
create table public.product_images (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references public.products(id) on delete cascade,
    image_url text not null,
    display_order integer default 0,
    is_primary boolean default false,
    created_at timestamp with time zone default now()
);

-- 5. Create Orders Table
create table public.orders (
    id uuid primary key default uuid_generate_v4(),
    customer_email text not null,
    customer_name text not null,
    total_amount numeric(10, 2) not null check (total_amount >= 0),
    status text not null check (status in ('pending', 'completed', 'cancelled')) default 'pending',
    payment_method text,
    shipping_address text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 6. Create Order Items Table
create table public.order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete restrict,
    quantity integer not null check (quantity > 0),
    price_at_purchase numeric(10, 2) not null check (price_at_purchase >= 0),
    created_at timestamp with time zone default now()
);

-- 7. Create Admin Users Table
create table public.admin_users (
    id uuid primary key references auth.users on delete cascade,
    email text not null unique,
    role text not null check (role in ('super_admin', 'editor', 'viewer')) default 'viewer',
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    last_login timestamp with time zone,
    updated_at timestamp with time zone default now()
);

-- 8. Create Analytics Snapshots Table
create table public.analytics_snapshots (
    id uuid primary key default uuid_generate_v4(),
    snapshot_date date not null default current_date,
    category_id uuid references public.categories(id) on delete set null,
    total_sold integer default 0,
    revenue numeric(12, 2) default 0,
    units_sold integer default 0,
    created_at timestamp with time zone default now()
);

-- 9. Create Discount Codes Table
create table public.discount_codes (
    id uuid primary key default uuid_generate_v4(),
    code text not null unique,
    discount_type text not null check (discount_type in ('percentage', 'fixed')),
    discount_value numeric(10, 2) not null check (discount_value > 0),
    usage_limit integer,
    usage_count integer default 0,
    expiry_date timestamp with time zone,
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 10. Update triggers for timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_categories_updated_at before update on public.categories for each row execute procedure public.handle_updated_at();
create trigger handle_brands_updated_at before update on public.brands for each row execute procedure public.handle_updated_at();
create trigger handle_products_updated_at before update on public.products for each row execute procedure public.handle_updated_at();
create trigger handle_orders_updated_at before update on public.orders for each row execute procedure public.handle_updated_at();
create trigger handle_admin_users_updated_at before update on public.admin_users for each row execute procedure public.handle_updated_at();
create trigger handle_discount_codes_updated_at before update on public.discount_codes for each row execute procedure public.handle_updated_at();

-- 11. Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_users enable row level security;
alter table public.analytics_snapshots enable row level security;
alter table public.discount_codes enable row level security;

-- Categories: Public read, Admin write
create policy "Allow public read-only access for categories" on public.categories for select using (true);
create policy "Allow admin write access for categories" on public.categories 
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- Brands: Public read, Admin write
create policy "Allow public read-only access for brands" on public.brands for select using (true);
create policy "Allow admin write access for brands" on public.brands 
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- Products: Public read, Admin write
create policy "Allow public read-only access for products" on public.products for select using (true);
create policy "Allow admin write access for products" on public.products 
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- Product Images: Public read, Admin write
create policy "Allow public read-only access for product images" on public.product_images for select using (true);
create policy "Allow admin write access for product images" on public.product_images 
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- Admin Users: Super Admin only access to manage admin users
create policy "Super Admins can manage all admin users" on public.admin_users 
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role = 'super_admin'));

-- Orders: Customer read own, Admin read all
create policy "Users can read own orders based on email" on public.orders 
    for select using (customer_email = auth.jwt() ->> 'email' or exists (select 1 from public.admin_users where id = auth.uid() and is_active = true));
create policy "Admins can manage all orders" on public.orders 
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- Order Items: Follows orders logic
create policy "Users can read own order items" on public.order_items 
    for select using (exists (select 1 from public.orders where id = order_id and (customer_email = auth.jwt() ->> 'email' or exists (select 1 from public.admin_users where id = auth.uid() and is_active = true))));
create policy "Admins can manage all order items" on public.order_items 
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- Discount Codes: Admin only
create policy "Admins can manage all discount codes" on public.discount_codes 
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- Analytics Snapshots: Admin only
create policy "Admins can read analytics" on public.analytics_snapshots 
    for select using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true));

-- 12. Supabase Storage Setup (via RPC or standard commands)
-- Creating buckets
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('admin-uploads', 'admin-uploads', false) on conflict (id) do nothing;

-- Storage Policies for 'product-images'
create policy "Public Read for product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Admin Upload for product images" on storage.objects 
    for insert with check (bucket_id = 'product-images' and exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));
create policy "Admin Delete for product images" on storage.objects 
    for delete using (bucket_id = 'product-images' and exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- Storage Policies for 'admin-uploads'
create policy "Admin Read/Write for admin uploads" on storage.objects 
    for all using (bucket_id = 'admin-uploads' and exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));
