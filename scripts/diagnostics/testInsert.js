import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsertImage() {
    console.log("Testing image insert with .select()...");
    const { data: prodData } = await supabase.from('products').select('id').limit(1);
    if (!prodData || prodData.length === 0) return;
    const productId = prodData[0].id;

    const { data, error } = await supabase
        .from('product_images')
        .insert([{
            product_id: productId,
            image_url: 'https://example.com/test.jpg',
            display_order: 99,
            is_primary: false
        }])
        .select(); // <--- CRITICAL to catch RLS failures

    if (error) {
        console.error("Insert failed with error:", error);
    } else {
        console.log("Insert succeeded, data returned:", data);
    }
}

testInsertImage();
