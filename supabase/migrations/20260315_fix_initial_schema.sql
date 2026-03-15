-- SAFE INITIAL SCHEMA (Idempotent)
-- Use this if you get "already exists" errors.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Categories Table
create table if not exists public.categories (
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
create table if not exists public.brands (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    slug text not null unique,
    logo_url text,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 3. Create Products Table
create table if not exists public.products (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    brand_id uuid references public.brands(id) on delete restrict,
    category_id uuid references public.categories(id) on delete restrict,
    price numeric(10, 2) not null check (price >= 0),
    original_price numeric(10, 2) check (original_price >= 0),
    rating numeric(2, 1) default 0 check (rating >= 0 and rating <= 5),
    reviews_count integer default 0 check (reviews_count >= 0),
    badge text,
    description text,
    stock_quantity integer default 0 check (stock_quantity >= 0),
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 4. Create Product Images Table
create table if not exists public.product_images (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references public.products(id) on delete cascade,
    image_url text not null,
    display_order integer default 0,
    is_primary boolean default false,
    created_at timestamp with time zone default now()
);

-- 5. Create Orders Table
create table if not exists public.orders (
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
create table if not exists public.order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete restrict,
    quantity integer not null check (quantity > 0),
    price_at_purchase numeric(10, 2) not null check (price_at_purchase >= 0),
    created_at timestamp with time zone default now()
);

-- 7. Create Admin Users Table
create table if not exists public.admin_users (
    id uuid primary key references auth.users on delete cascade,
    email text not null unique,
    role text not null check (role in ('super_admin', 'editor', 'viewer')) default 'viewer',
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    last_login timestamp with time zone,
    updated_at timestamp with time zone default now()
);

-- 8. Create Analytics Snapshots Table
create table if not exists public.analytics_snapshots (
    id uuid primary key default uuid_generate_v4(),
    snapshot_date date not null default current_date,
    category_id uuid references public.categories(id) on delete set null,
    total_sold integer default 0,
    revenue numeric(12, 2) default 0,
    units_sold integer default 0,
    created_at timestamp with time zone default now()
);

-- 9. Create Discount Codes Table
create table if not exists public.discount_codes (
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

-- Enable RLS (Safe to re-run)
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_users enable row level security;
alter table public.analytics_snapshots enable row level security;
alter table public.discount_codes enable row level security;
