import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hpazftfsqldshimqhejr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwYXpmdGZzcWxkc2hpbXFoZWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2ODIzNTgsImV4cCI6MjA4NzI1ODM1OH0.0zkbidLDN4s7AF42C8G1JfFfH5AUsVPYrnlxuFdl2DY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: cat } = await supabase.from('categories').select('*');
    console.log("Categories:", JSON.stringify(cat, null, 2));

    const { data: prod } = await supabase.from('products').select('*').ilike('name', '%asdasdasdas%');
    console.log("Products:", JSON.stringify(prod, null, 2));
}
check();
