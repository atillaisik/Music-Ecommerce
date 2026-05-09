-- IMPLEMENTATION_16 Phase 4: editorial articles table for the Learn page.
-- Public read for is_published = true, admin write (RLS).
--
-- Originally applied via Supabase MCP `apply_migration` with name
-- `implementation_16_articles_table`. Saved to a file here for repo
-- reproducibility.

create table if not exists public.articles (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    excerpt text,
    body text,
    image_url text,
    category text,
    read_time_minutes integer,
    is_published boolean not null default true,
    published_at timestamptz default now(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.articles enable row level security;

drop policy if exists "Public can read published articles" on public.articles;
create policy "Public can read published articles" on public.articles
    for select using (is_published = true);

drop policy if exists "Admins can manage articles" on public.articles;
create policy "Admins can manage articles" on public.articles
    for all using (
        exists (select 1 from public.admin_users
                where id = auth.uid() and is_active = true)
    ) with check (
        exists (select 1 from public.admin_users
                where id = auth.uid() and is_active = true)
    );

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
    before update on public.articles
    for each row execute function public.handle_updated_at();
