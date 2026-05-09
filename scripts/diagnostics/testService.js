import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
// Use service role key to bypass RLS!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SURPABASE_SERVICE_ROLE_KEY credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDb() {
    console.log("Checking admin_users table...");
    const { data: adminUsers, error: err1 } = await supabase.from('admin_users').select('*');
    console.log("admin_users:", err1 ? err1.message : adminUsers);

    console.log("Checking products...");
    const { data: prods, error: err2 } = await supabase.from('products').select('id, name, created_at').order('created_at', { ascending: false }).limit(2);
    console.log("products:", err2 ? err2.message : prods);

    console.log("Checking product_images...");
    const { data: imgs, error: err3 } = await supabase.from('product_images').select('*').limit(2);
    console.log("product_images:", err3 ? err3.message : imgs);
}

inspectDb();
