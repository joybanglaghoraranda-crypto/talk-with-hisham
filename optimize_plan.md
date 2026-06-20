1. **Goal**: Optimize the comment count fetching in `PublicFeed.tsx`.
2. **Current approach**: Fetching all post_ids, then fetching all `comments` (just their `post_id`) for these post_ids, potentially retrieving thousands of rows. Then iterating in JS to group them and count.
3. **Problem**: Extremely slow when there are many comments (O(N) network payload size where N is the total number of comments, plus high DB I/O fetching all rows).
4. **Solution**: Use Supabase's relation count feature.
   - Supabase PostgREST allows getting related counts via: `.select('*, profiles(...), comments(count)')`.
   - Update the initial `fetchPosts` query to include `comments:comments(count)`. This fetches the comment count directly in the SQL level (using `COUNT()`), returning O(1) payload per post instead of O(N) comments per post.
   - Adjust `commentCounts` state. We actually can just map from the returned post objects instead of keeping a separate fetch block.
   - Modify the interface/type to allow `comments: [{ count: number }]`.
5. **Implementation Steps**:
   - Create a benchmark script (already created `benchmark.js`) to prove payload and time savings.
   - Modify `src/components/feed/PublicFeed.tsx` lines 36-54. Replace the secondary `comments` fetch with the `comments:comments(count)` included in the primary `posts` fetch.
   - Ensure the new counts are stored correctly in `setCommentCounts`.
   - Ensure it compiles via `npm run build`.
   - Run linter: `npm run lint`.
6. **Plan Review**: Propose this plan to complete the optimization task.
