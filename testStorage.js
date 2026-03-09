import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
    console.log("Checking storage buckets...");
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error("Error listing buckets:", error);
    } else {
        console.log("Buckets:", data.map(b => b.name));
    }
}

checkStorage();
