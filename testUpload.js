import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
    console.log("Testing upload...");
    // Create a dummy file buffer
    const fileContent = new Blob(['test dummy content'], { type: 'text/plain' });
    const fileName = `test-${Date.now()}.txt`;

    const { data, error } = await supabase.storage
        .from('product-images')
        .upload(`products/${fileName}`, fileContent);

    if (error) {
        console.error("Upload failed with error:", JSON.stringify(error, null, 2));
    } else {
        console.log("Upload succeeded:", data);
    }
}

testUpload();
