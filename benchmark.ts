import { getSupabaseClient } from './src/lib/supabase/client';

// Just a pseudo-benchmark that shows the difference
console.log("Setting up baseline measure...");
let queries = 0;

// Simulate N inserts
const N = 50;
const sender_id = "user-123";

// Original behavior
for (let i = 0; i < N; i++) {
  // supabase.from('profiles').select().eq('id', sender_id).single()
  queries++;
}

console.log(`Original: ${queries} DB queries for ${N} messages from the same user`);

// Optimized behavior
let optimizedQueries = 0;
const cache = new Map();
for (let i = 0; i < N; i++) {
  if (!cache.has(sender_id)) {
    cache.set(sender_id, true);
    optimizedQueries++;
  }
}

console.log(`Optimized: ${optimizedQueries} DB queries for ${N} messages from the same user`);
