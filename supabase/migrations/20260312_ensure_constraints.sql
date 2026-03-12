-- Ensure unique constraint for site_content
DO $$ 
BEGIN 
    -- Check if the constraint exists
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'site_content_page_name_section_name_key'
    ) THEN
        -- Attempt to add it. This might fail if duplicates already exist, 
        -- but if it's a new table it should be fine.
        ALTER TABLE public.site_content 
        ADD CONSTRAINT site_content_page_name_section_name_key UNIQUE (page_name, section_name);
    END IF;
END $$;

-- Also ensure the admin_users table can be read by authenticated users for RLS
-- (This was in the previous migration but let's re-verify)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admin_users' AND policyname = 'Allow users to read their own record'
    ) THEN
        CREATE POLICY "Allow users to read their own record" ON public.admin_users
        FOR SELECT USING (auth.uid() = id);
    END IF;
END $$;
