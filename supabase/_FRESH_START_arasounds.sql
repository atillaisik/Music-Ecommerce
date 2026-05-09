-- ============================================================
-- ArasSounds — Fresh Start SQL Bundle
-- ============================================================
-- Apply ONCE to a brand-new Supabase project.
-- Represents the final schema state after IMPLEMENTATION_2 → IMPLEMENTATION_16
-- (i.e. equivalent to running every file in supabase/migrations/ in order,
-- with conflicts resolved and Phase 1 RLS hardening already applied).
--
-- Idempotent — safe to re-run; uses `if not exists` and `drop ... if exists`.
--
-- HOW TO APPLY:
--   1. Open https://supabase.com/dashboard → arasounds project
--   2. SQL Editor → New query
--   3. Paste this entire file
--   4. Run
--   5. Run the verification queries at the bottom; expected results in comments.
-- ============================================================

begin;

-- ============================================================
-- 0. EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. UPDATED_AT TRIGGER FUNCTION (used by every domain table)
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- ============================================================
-- 2. CATEGORIES + BRANDS
-- ============================================================
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

create table if not exists public.brands (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    slug text not null unique,
    logo_url text,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- ============================================================
-- 3. PRODUCTS + PRODUCT_IMAGES (with featured/on_sale from Phase 1)
-- ============================================================
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
    featured boolean default false not null,
    on_sale boolean default false not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create index if not exists products_featured_idx
    on public.products (featured) where featured = true;
create index if not exists products_on_sale_idx
    on public.products (on_sale) where on_sale = true;

create table if not exists public.product_images (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references public.products(id) on delete cascade,
    image_url text not null,
    display_order integer default 0,
    is_primary boolean default false,
    created_at timestamp with time zone default now()
);

-- ============================================================
-- 4. ADMIN_USERS (depends on auth.users)
-- ============================================================
create table if not exists public.admin_users (
    id uuid primary key references auth.users on delete cascade,
    email text not null unique,
    role text not null check (role in ('super_admin', 'editor', 'viewer')) default 'viewer',
    is_active boolean default true,
    created_at timestamp with time zone default now(),
    last_login timestamp with time zone,
    updated_at timestamp with time zone default now()
);

-- ============================================================
-- 5. PROFILES (customer-side auth) + auto-create on signup
-- ============================================================
create table if not exists public.profiles (
    id uuid primary key references auth.users on delete cascade,
    full_name text,
    avatar_url text,
    phone text,
    address text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Profile-id immutability (Phase 1 defense-in-depth)
create or replace function public.protect_profile_immutables()
returns trigger
language plpgsql
security definer
as $$
begin
    if new.id is distinct from old.id then
        raise exception 'profiles.id is immutable';
    end if;
    return new;
end;
$$;

drop trigger if exists protect_profile_immutables_trigger on public.profiles;
create trigger protect_profile_immutables_trigger
    before update on public.profiles
    for each row execute procedure public.protect_profile_immutables();

-- Auto-create profile when an auth user signs up
create or replace function public.handle_new_user_profile()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        coalesce(new.raw_user_meta_data->>'avatar_url', '')
    );
    return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user_profile();

-- ============================================================
-- 6. ORDERS + ORDER_ITEMS (user_id nullable for guest checkout)
-- ============================================================
create table if not exists public.orders (
    id uuid primary key default uuid_generate_v4(),
    customer_email text not null,
    customer_name text not null,
    total_amount numeric(10, 2) not null check (total_amount >= 0),
    status text not null check (status in ('pending', 'completed', 'cancelled')) default 'pending',
    payment_method text,
    shipping_address text,
    user_id uuid references public.profiles(id) on delete set null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create table if not exists public.order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references public.orders(id) on delete cascade,
    product_id uuid references public.products(id) on delete restrict,
    quantity integer not null check (quantity > 0),
    price_at_purchase numeric(10, 2) not null check (price_at_purchase >= 0),
    created_at timestamp with time zone default now()
);

-- ============================================================
-- 7. PRODUCT_REVIEWS (nullable user_id for guest reviews)
-- ============================================================
create table if not exists public.product_reviews (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references public.products(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade,
    user_name text not null,
    reviewer_email text,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Spam guards
create unique index if not exists product_reviews_unique_user_idx
    on public.product_reviews (product_id, user_id) where user_id is not null;
create unique index if not exists product_reviews_unique_guest_idx
    on public.product_reviews (product_id, reviewer_email)
    where user_id is null and reviewer_email is not null;

-- Product rating aggregator
create or replace function public.update_product_rating()
returns trigger as $$
declare
    v_product_id uuid;
    v_avg_rating numeric;
    v_count integer;
begin
    if tg_op = 'INSERT' then
        v_product_id := new.product_id;
    elsif tg_op = 'UPDATE' then
        v_product_id := new.product_id;
    elsif tg_op = 'DELETE' then
        v_product_id := old.product_id;
    end if;

    select coalesce(round(avg(rating)::numeric, 1), 0), count(*)
    into v_avg_rating, v_count
    from public.product_reviews where product_id = v_product_id;

    update public.products set rating = v_avg_rating, reviews_count = v_count
    where id = v_product_id;

    if tg_op = 'DELETE' then
        return old;
    else
        return new;
    end if;
end;
$$ language plpgsql;

drop trigger if exists update_product_rating_trigger on public.product_reviews;
create trigger update_product_rating_trigger
    after insert or update or delete on public.product_reviews
    for each row execute procedure public.update_product_rating();

-- ============================================================
-- 8. WISHLIST_ITEMS
-- ============================================================
create table if not exists public.wishlist_items (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    created_at timestamp with time zone default now(),
    unique(user_id, product_id)
);

-- ============================================================
-- 9. ANALYTICS + DISCOUNTS
-- ============================================================
create table if not exists public.analytics_snapshots (
    id uuid primary key default uuid_generate_v4(),
    snapshot_date date not null default current_date,
    category_id uuid references public.categories(id) on delete set null,
    total_sold integer default 0,
    revenue numeric(12, 2) default 0,
    units_sold integer default 0,
    created_at timestamp with time zone default now()
);

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

-- ============================================================
-- 10. SITE_CONTENT (CMS-ish JSONB blocks)
-- ============================================================
create table if not exists public.site_content (
    id uuid primary key default uuid_generate_v4(),
    page_name text not null,
    section_name text not null,
    content jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(page_name, section_name)
);

-- Seed deals page content
insert into public.site_content (page_name, section_name, content)
values (
    'deals', 'banner',
    '{"badge":"Limited Time","title":"Deals & Offers","subtitle":"Save big on premium instruments — while stocks last!"}'::jsonb
)
on conflict (page_name, section_name) do nothing;

-- ============================================================
-- 11. AUDIT TABLES (order_status_history, inventory_logs)
-- ============================================================
create table if not exists public.order_status_history (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references public.orders(id) on delete cascade,
    status text not null,
    changed_by uuid references auth.users(id),
    created_at timestamp with time zone default now()
);

create or replace function public.log_order_status_change()
returns trigger as $$
begin
    if (old.status is null or old.status <> new.status) then
        insert into public.order_status_history (order_id, status)
        values (new.id, new.status);
    end if;
    return new;
end;
$$ language plpgsql;

drop trigger if exists on_order_status_change on public.orders;
create trigger on_order_status_change
    after insert or update on public.orders
    for each row execute procedure public.log_order_status_change();

create table if not exists public.inventory_logs (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references public.products(id) on delete cascade,
    old_quantity integer,
    new_quantity integer,
    reason text,
    created_at timestamp with time zone default now()
);

create or replace function public.log_inventory_change()
returns trigger as $$
begin
    if (old.stock_quantity <> new.stock_quantity) then
        insert into public.inventory_logs (product_id, old_quantity, new_quantity)
        values (new.id, old.stock_quantity, new.stock_quantity);
    end if;
    return new;
end;
$$ language plpgsql;

drop trigger if exists on_inventory_change on public.products;
create trigger on_inventory_change
    after update on public.products
    for each row execute procedure public.log_inventory_change();

-- ============================================================
-- 12. UPDATED_AT TRIGGERS for every table that has updated_at
-- ============================================================
drop trigger if exists handle_categories_updated_at on public.categories;
create trigger handle_categories_updated_at before update on public.categories
    for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_brands_updated_at on public.brands;
create trigger handle_brands_updated_at before update on public.brands
    for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_products_updated_at on public.products;
create trigger handle_products_updated_at before update on public.products
    for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_orders_updated_at on public.orders;
create trigger handle_orders_updated_at before update on public.orders
    for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_admin_users_updated_at on public.admin_users;
create trigger handle_admin_users_updated_at before update on public.admin_users
    for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_discount_codes_updated_at on public.discount_codes;
create trigger handle_discount_codes_updated_at before update on public.discount_codes
    for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_profiles_updated_at on public.profiles;
create trigger handle_profiles_updated_at before update on public.profiles
    for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_product_reviews_updated_at on public.product_reviews;
create trigger handle_product_reviews_updated_at before update on public.product_reviews
    for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_site_content_updated_at on public.site_content;
create trigger handle_site_content_updated_at before update on public.site_content
    for each row execute procedure public.handle_updated_at();

-- ============================================================
-- 13. ROW-LEVEL SECURITY (enable on every table)
-- ============================================================
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;
alter table public.product_reviews enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.analytics_snapshots enable row level security;
alter table public.discount_codes enable row level security;
alter table public.site_content enable row level security;

-- ============================================================
-- 14. RLS POLICIES — Categories / Brands / Products / Images
-- ============================================================
drop policy if exists "Allow public read-only access for categories" on public.categories;
create policy "Allow public read-only access for categories" on public.categories for select using (true);

drop policy if exists "Allow admin write access for categories" on public.categories;
create policy "Allow admin write access for categories" on public.categories
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

drop policy if exists "Allow public read-only access for brands" on public.brands;
create policy "Allow public read-only access for brands" on public.brands for select using (true);

drop policy if exists "Allow admin write access for brands" on public.brands;
create policy "Allow admin write access for brands" on public.brands
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

drop policy if exists "Allow public read-only access for products" on public.products;
create policy "Allow public read-only access for products" on public.products for select using (true);

drop policy if exists "Allow admin write access for products" on public.products;
create policy "Allow admin write access for products" on public.products
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

drop policy if exists "Allow public read-only access for product images" on public.product_images;
create policy "Allow public read-only access for product images" on public.product_images for select using (true);

drop policy if exists "Allow admin write access for product images" on public.product_images;
create policy "Allow admin write access for product images" on public.product_images
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- ============================================================
-- 15. RLS POLICIES — Admin users / Profiles
-- ============================================================
drop policy if exists "Super Admins can manage all admin users" on public.admin_users;
create policy "Super Admins can manage all admin users" on public.admin_users
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role = 'super_admin'));

drop policy if exists "Allow users to read their own record" on public.admin_users;
create policy "Allow users to read their own record" on public.admin_users
    for select using (auth.uid() = id);

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" on public.profiles
    for select using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles
    for select using (
        exists (select 1 from public.admin_users where id = auth.uid() and is_active = true)
    );

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
    for update using (auth.uid() = id) with check (auth.uid() = id);

-- INSERT policy for profiles is unnecessary because the trigger handles it (security definer).

-- ============================================================
-- 16. RLS POLICIES — Orders + Order items (Phase 1 hardened)
-- ============================================================
drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders" on public.orders
    for select using (
        (auth.uid() is not null and user_id = auth.uid())
        or (customer_email = auth.jwt() ->> 'email')
        or exists (select 1 from public.admin_users where id = auth.uid() and is_active = true)
    );

drop policy if exists "Allow order creation by self or guest" on public.orders;
create policy "Allow order creation by self or guest" on public.orders
    for insert with check (
        (auth.uid() is not null and user_id = auth.uid())
        or (auth.uid() is null and user_id is null)
    );

drop policy if exists "Admins can manage all orders" on public.orders;
create policy "Admins can manage all orders" on public.orders
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

drop policy if exists "Users can read own order items" on public.order_items;
create policy "Users can read own order items" on public.order_items
    for select using (
        exists (
            select 1 from public.orders o where o.id = order_id and (
                (auth.uid() is not null and o.user_id = auth.uid())
                or (o.customer_email = auth.jwt() ->> 'email')
                or exists (select 1 from public.admin_users where id = auth.uid() and is_active = true)
            )
        )
    );

drop policy if exists "Allow order_items insert with order" on public.order_items;
create policy "Allow order_items insert with order" on public.order_items
    for insert with check (
        exists (
            select 1 from public.orders o where o.id = order_id and (
                (auth.uid() is not null and o.user_id = auth.uid())
                or (auth.uid() is null and o.user_id is null)
            )
        )
    );

drop policy if exists "Admins can manage all order items" on public.order_items;
create policy "Admins can manage all order items" on public.order_items
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- ============================================================
-- 17. RLS POLICIES — Reviews (Phase 1 hardened)
-- ============================================================
drop policy if exists "Allow public read-only access for product reviews" on public.product_reviews;
create policy "Allow public read-only access for product reviews"
    on public.product_reviews for select using (true);

drop policy if exists "Reviews insert by self or guest" on public.product_reviews;
create policy "Reviews insert by self or guest" on public.product_reviews
    for insert with check (
        user_name is not null and length(trim(user_name)) > 0
        and (
            (auth.uid() is not null and user_id = auth.uid())
            or (auth.uid() is null and user_id is null)
        )
    );

drop policy if exists "Allow admin write access for product reviews" on public.product_reviews;
create policy "Allow admin write access for product reviews" on public.product_reviews
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- ============================================================
-- 18. RLS POLICIES — Wishlist
-- ============================================================
drop policy if exists "Users can manage their own wishlist" on public.wishlist_items;
create policy "Users can manage their own wishlist" on public.wishlist_items
    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Admins can view all wishlists" on public.wishlist_items;
create policy "Admins can view all wishlists" on public.wishlist_items
    for select using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true));

-- ============================================================
-- 19. RLS POLICIES — Discounts / Analytics / Site content
-- ============================================================
drop policy if exists "Admins can manage all discount codes" on public.discount_codes;
create policy "Admins can manage all discount codes" on public.discount_codes
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

drop policy if exists "Admins can read analytics" on public.analytics_snapshots;
create policy "Admins can read analytics" on public.analytics_snapshots
    for select using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true));

drop policy if exists "Allow public read-only access for site_content" on public.site_content;
create policy "Allow public read-only access for site_content" on public.site_content for select using (true);

drop policy if exists "Allow admin full access for site_content" on public.site_content;
create policy "Allow admin full access for site_content" on public.site_content
    for all
    using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')))
    with check (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- ============================================================
-- 20. STORAGE — Buckets + Policies (product-images, admin-uploads, avatars)
-- ============================================================
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
    on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('admin-uploads', 'admin-uploads', false)
    on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
    on conflict (id) do nothing;

-- product-images: public read, admin write
drop policy if exists "Public Read for product images" on storage.objects;
create policy "Public Read for product images" on storage.objects
    for select using (bucket_id = 'product-images');

drop policy if exists "Admin Upload for product images" on storage.objects;
create policy "Admin Upload for product images" on storage.objects
    for insert with check (
        bucket_id = 'product-images'
        and exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor'))
    );

drop policy if exists "Admin Delete for product images" on storage.objects;
create policy "Admin Delete for product images" on storage.objects
    for delete using (
        bucket_id = 'product-images'
        and exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor'))
    );

-- admin-uploads: admin only
drop policy if exists "Admin Read/Write for admin uploads" on storage.objects;
create policy "Admin Read/Write for admin uploads" on storage.objects
    for all using (
        bucket_id = 'admin-uploads'
        and exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor'))
    );

-- avatars: public read, user-scoped writes (path-prefixed by auth.uid())
drop policy if exists "Public read for avatars" on storage.objects;
create policy "Public read for avatars" on storage.objects
    for select using (bucket_id = 'avatars');

drop policy if exists "Users upload own avatar" on storage.objects;
create policy "Users upload own avatar" on storage.objects
    for insert with check (
        bucket_id = 'avatars'
        and auth.uid() is not null
        and (storage.foldername(name))[1] = auth.uid()::text
    );

drop policy if exists "Users update own avatar" on storage.objects;
create policy "Users update own avatar" on storage.objects
    for update using (
        bucket_id = 'avatars'
        and auth.uid() is not null
        and (storage.foldername(name))[1] = auth.uid()::text
    );

drop policy if exists "Users delete own avatar" on storage.objects;
create policy "Users delete own avatar" on storage.objects
    for delete using (
        bucket_id = 'avatars'
        and auth.uid() is not null
        and (storage.foldername(name))[1] = auth.uid()::text
    );

commit;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Run each of these AFTER the bundle commits.
-- If any return zero rows where rows are expected, something failed.

-- 1. Tables in public schema (expected: 14 tables)
-- select table_name from information_schema.tables
-- where table_schema = 'public' order by table_name;

-- 2. Storage buckets (expected: 3 — product-images, admin-uploads, avatars)
-- select id, name, public from storage.buckets order by id;

-- 3. RLS enabled on every public table (expected: all 't')
-- select tablename, rowsecurity from pg_tables where schemaname = 'public' order by tablename;

-- 4. Number of policies on each table (each should have ≥1)
-- select tablename, count(*) as policy_count from pg_policies
-- where schemaname = 'public' group by tablename order by tablename;

-- 5. Confirm the orders INSERT policy uses the new auth.uid() check
-- select policyname, cmd from pg_policies where tablename = 'orders' order by policyname;

-- 6. Confirm reviews INSERT policy is the hardened one
-- select policyname, qual, with_check from pg_policies where tablename = 'product_reviews' order by policyname;

-- 7. Confirm products has featured + on_sale columns
-- select column_name, data_type, is_nullable, column_default from information_schema.columns
-- where table_schema='public' and table_name='products' and column_name in ('featured','on_sale');

-- 8. Confirm avatars policies exist
-- select policyname from pg_policies where schemaname = 'storage' and policyname ilike '%avatar%' order by policyname;
