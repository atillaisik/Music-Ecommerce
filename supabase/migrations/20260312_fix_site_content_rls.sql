-- Admin Users RLS Fixes
-- Allow authenticated users to read their own record (essential for RLS checks)
create policy "Allow users to read their own record" on public.admin_users
    for select using (auth.uid() = id);

-- Site Content RLS Improvements
-- Drop current restrictive policy
drop policy if exists "Allow admin write access for site_content" on public.site_content;

-- Create more comprehensive policy for all operations
create policy "Allow admin full access for site_content" on public.site_content 
    for all 
    using (
        exists (
            select 1 from public.admin_users 
            where id = auth.uid() 
            and is_active = true 
            and role in ('super_admin', 'editor')
        )
    )
    with check (
        exists (
            select 1 from public.admin_users 
            where id = auth.uid() 
            and is_active = true 
            and role in ('super_admin', 'editor')
        )
    );
