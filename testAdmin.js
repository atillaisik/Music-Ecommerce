import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
// Need service role key to bypass RLS and query admin_users, but anon key might suffice if we assume a logged-in state or public read.
// Let's just query auth.users and admin_users using a service_role key if we can, or just try anon key.
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRLS() {
    console.log("Fetching admin users...");
    const { data: adminUsers, error: adminErr } = await supabase.from('admin_users').select('*');
    if (adminErr) {
        console.error("Error reading admin_users (RLS might block read):", adminErr);
    } else {
        console.log("Admin Users:", adminUsers);
    }
}

checkRLS();
