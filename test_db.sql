CREATE OR REPLACE FUNCTION get_post_comment_counts(post_ids UUID[])
RETURNS TABLE (post_id UUID, comment_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT c.post_id, COUNT(*) as comment_count
  FROM comments c
  WHERE c.post_id = ANY(post_ids)
  GROUP BY c.post_id;
END;
$$ LANGUAGE plpgsql;
