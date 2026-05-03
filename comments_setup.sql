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
CREATE POLICY "Authenticated users can update post likes"
  ON posts FOR UPDATE USING (auth.role() = 'authenticated');
