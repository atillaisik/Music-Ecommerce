import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
    console.log("Fetching products with images...");
    const { data, error } = await supabase
        .from('products')
        .select('id, name, images:product_images(image_url)')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    console.log(JSON.stringify(data, null, 2));
}

checkProducts();
