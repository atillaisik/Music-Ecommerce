-- Deals Management Migration
-- Create site_content table for managing page-specific content

create table if not exists public.site_content (
    id uuid primary key default uuid_generate_v4(),
    page_name text not null,
    section_name text not null,
    content jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(page_name, section_name)
);

-- Enable RLS
alter table public.site_content enable row level security;

-- Policies
create policy "Allow public read-only access for site_content" on public.site_content for select using (true);
create policy "Allow admin write access for site_content" on public.site_content 
    for all using (exists (select 1 from public.admin_users where id = auth.uid() and is_active = true and role in ('super_admin', 'editor')));

-- Trigger for updated_at
create trigger handle_site_content_updated_at before update on public.site_content for each row execute procedure public.handle_updated_at();

-- Seed initial deals page content
insert into public.site_content (page_name, section_name, content)
values (
    'deals', 
    'banner', 
    '{
        "badge": "Limited Time",
        "title": "Deals & Offers",
        "subtitle": "Save big on premium instruments — while stocks last!"
    }'::jsonb
)
on conflict (page_name, section_name) do nothing;
