-- Comments table for post replies
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Everyone can read comments
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE USING (auth.uid() = author_id);

-- Add UPDATE policy for posts (needed for like updates)
-- Remove existing permissive UPDATE policy if it exists
DROP POLICY IF EXISTS "Authenticated users can update post likes" ON posts;

-- Revoke general UPDATE access from the authenticated role to prevent full row updates
REVOKE UPDATE ON posts FROM authenticated;
REVOKE UPDATE ON posts FROM anon;

-- Grant UPDATE only on the specific columns (reactions, likes_count) to authenticated users
GRANT UPDATE (reactions, likes_count) ON posts TO authenticated;

-- Add UPDATE policy for posts to allow the column-specific update
CREATE POLICY "Authenticated users can update post likes and reactions"
  ON posts FOR UPDATE USING (auth.role() = 'authenticated');
