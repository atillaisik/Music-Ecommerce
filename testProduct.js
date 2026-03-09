import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsertProduct() {
    console.log("Testing product insert anonymously...");
    const { data, error } = await supabase
        .from('products')
        .insert([{
            name: 'Test RLS Product',
            price: 100,
            stock_quantity: 10
        }])
        .select();

    if (error) {
        console.error("Product insert failed with error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Product insert succeeded:", data);
    }
}

testInsertProduct();
