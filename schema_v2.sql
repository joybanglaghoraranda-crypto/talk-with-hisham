-- ============================================
-- FULL SCHEMA UPDATE: Talk with Hisham v2.0
-- Run this in Supabase SQL Editor
-- ============================================

-- TABLE: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  reactions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  image_url TEXT,
  reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
  reactions JSONB DEFAULT '{}'::jsonb,
  read_by JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: private_messages
CREATE TABLE IF NOT EXISTS private_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_contact TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  admin_reply TEXT,
  admin_reply_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RLS POLICIES FOR PROFILES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);


-- ============================================
-- RLS POLICIES FOR POSTS
-- ============================================
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Posts are viewable by everyone." ON posts;
CREATE POLICY "Posts are viewable by everyone." ON posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admin can create posts." ON posts;
CREATE POLICY "Only admin can create posts." ON posts FOR INSERT WITH CHECK (
  (auth.jwt() ->> 'email') = 'ibnenurakondo@gmail.com'
);

DROP POLICY IF EXISTS "Users can delete own posts." ON posts;
CREATE POLICY "Users can delete own posts." ON posts FOR DELETE USING (auth.uid() = author_id);


-- ============================================
-- RLS POLICIES FOR MESSAGES
-- ============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Messages are viewable by everyone." ON messages;
CREATE POLICY "Messages are viewable by everyone." ON messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can send messages." ON messages;
CREATE POLICY "Authenticated users can send messages." ON messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update message reactions." ON messages;
CREATE POLICY "Authenticated users can update message reactions." ON messages FOR UPDATE USING (auth.role() = 'authenticated');

-- FUNCTION: Restrict message updates by non-senders
CREATE OR REPLACE FUNCTION restrict_message_updates()
RETURNS TRIGGER AS $$
BEGIN
  -- If the user performing the update is NOT the original sender
  IF auth.uid() IS DISTINCT FROM OLD.sender_id THEN
    -- They are only allowed to modify reactions and read_by
    IF (to_jsonb(NEW) - 'reactions' - 'read_by') IS DISTINCT FROM (to_jsonb(OLD) - 'reactions' - 'read_by') THEN
       RAISE EXCEPTION 'Not authorized to modify message content.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: Apply the restriction to the messages table
DROP TRIGGER IF EXISTS restrict_message_updates_trigger ON messages;
CREATE TRIGGER restrict_message_updates_trigger
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION restrict_message_updates();


-- ============================================
-- RLS POLICIES FOR PRIVATE_MESSAGES
-- ============================================
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can send a private message" ON private_messages;
CREATE POLICY "Anyone can send a private message" ON private_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Senders can view their own private messages" ON private_messages;
CREATE POLICY "Senders can view their own private messages" ON private_messages FOR SELECT USING (
  auth.uid() = sender_id
  OR (auth.jwt() ->> 'email') = 'ibnenurakondo@gmail.com'
);

DROP POLICY IF EXISTS "Only admin can update private messages" ON private_messages;
CREATE POLICY "Only admin can update private messages" ON private_messages FOR UPDATE USING (
  (auth.jwt() ->> 'email') = 'ibnenurakondo@gmail.com'
);

DROP POLICY IF EXISTS "Only admin can delete private messages" ON private_messages;
CREATE POLICY "Only admin can delete private messages" ON private_messages FOR DELETE USING (
  (auth.jwt() ->> 'email') = 'ibnenurakondo@gmail.com'
);


-- ============================================
-- REALTIME
-- ============================================
-- This will automatically enable Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE private_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ============================================
-- TABLE: comments (for post replies)
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = author_id);


-- ============================================
-- COLUMN-SPECIFIC UPDATE POLICIES FOR POSTS
-- ============================================
-- Remove existing permissive UPDATE policy if it exists
DROP POLICY IF EXISTS "Authenticated users can update post likes" ON posts;

-- Revoke general UPDATE access from the authenticated role to prevent full row updates
REVOKE UPDATE ON posts FROM authenticated;
REVOKE UPDATE ON posts FROM anon;

-- Grant UPDATE only on the specific columns (reactions, likes_count) to authenticated users
GRANT UPDATE (reactions, likes_count) ON posts TO authenticated;

-- Add UPDATE policy for posts to allow the column-specific update
DROP POLICY IF EXISTS "Authenticated users can update post likes and reactions" ON posts;
CREATE POLICY "Authenticated users can update post likes and reactions" ON posts FOR UPDATE USING (auth.role() = 'authenticated');

