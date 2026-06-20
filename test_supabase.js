const { createClient } = require('@supabase/supabase-js');
const client = createClient('http://localhost', 'dummy');

// Supabase relation count syntax: select('*, comments(count)')
// Let's create an RPC or check if Supabase allows us to count via relation.
console.log('We will write an RPC function in sql and call it from the frontend, OR modify the main query.');

// Let's test modifying the main query:
// const { data, error } = await supabase
//   .from('posts')
//   .select('*, profiles(username, full_name, avatar_url), comments(count)')
//   .order('created_at', { ascending: false })
//   .limit(30);
