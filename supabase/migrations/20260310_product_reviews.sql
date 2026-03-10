-- Create Product Reviews Table
create table public.product_reviews (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references public.products(id) on delete cascade not null,
    user_id text not null, -- Storing text since frontend uses a mock local store with generated IDs
    user_name text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Handle updated_at
create trigger handle_product_reviews_updated_at 
    before update on public.product_reviews 
    for each row execute procedure public.handle_updated_at();

-- Enable RLS
alter table public.product_reviews enable row level security;

-- RLS Policies
-- Allow public read access (anyone can see reviews)
create policy "Allow public read-only access for product reviews" 
    on public.product_reviews for select using (true);

-- Allow public insert access (since the app uses pseudo-auth for customers right now)
create policy "Allow public insert for product reviews" 
    on public.product_reviews for insert with check (true);

-- Allow admins to manage reviews (update/delete)
create policy "Allow admin write access for product reviews" 
    on public.product_reviews 
    for all using (
        exists (
            select 1 from public.admin_users 
            where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')
        )
    );

-- Create Function to update Product rating and reviews_count
create or replace function public.update_product_rating()
returns trigger as $$
declare
    v_product_id uuid;
    v_avg_rating numeric;
    v_count integer;
begin
    -- Determine which product_id to update based on the operation
    if tg_op = 'INSERT' then
        v_product_id := new.product_id;
    elsif tg_op = 'UPDATE' then
        v_product_id := new.product_id;
    elsif tg_op = 'DELETE' then
        v_product_id := old.product_id;
    end if;

    -- Calculate the new average rating and count
    select 
        coalesce(round(avg(rating)::numeric, 1), 0),
        count(*)
    into v_avg_rating, v_count
    from public.product_reviews
    where product_id = v_product_id;

    -- Update the product table
    update public.products
    set 
        rating = v_avg_rating,
        reviews_count = v_count
    where id = v_product_id;

    if tg_op = 'DELETE' then
        return old;
    else
        return new;
    end if;
end;
$$ language plpgsql;

-- Create Trigger for after insert, update, or delete on product_reviews
create trigger update_product_rating_trigger
    after insert or update or delete on public.product_reviews
    for each row execute procedure public.update_product_rating();
