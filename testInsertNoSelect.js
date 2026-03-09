import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsertImageNoSelect() {
    console.log("Testing image insert WITHOUT .select()...");
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
        }]);

    console.log("Data:", data);
    console.log("Error:", error);
}

testInsertImageNoSelect();
