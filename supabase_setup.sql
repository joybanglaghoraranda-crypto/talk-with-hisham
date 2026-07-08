-- TABLE: profiles
-- Stores user profile information
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: posts
-- Social feed posts
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TABLE: messages
-- Real-time chat messages
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  image_url TEXT,
  reactions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STORAGE BUCKETS
-- Create buckets for avatars and media
-- (Note: These are usually created in the Supabase Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- RLS POLICIES FOR PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." 
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." 
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- RLS POLICIES FOR POSTS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone." 
  ON posts FOR SELECT USING (true);

CREATE POLICY "Only admin can create posts." 
  ON posts FOR INSERT WITH CHECK (
    (auth.jwt() ->> 'email') = 'ibnenurakondo@gmail.com'
  );

CREATE POLICY "Users can delete own posts." 
  ON posts FOR DELETE USING (auth.uid() = author_id);

-- RLS POLICIES FOR MESSAGES
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages are viewable by everyone." 
  ON messages FOR SELECT USING (true);

CREATE POLICY "Authenticated users can send messages." 
  ON messages FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update message reactions." 
  ON messages FOR UPDATE USING (auth.role() = 'authenticated');

-- TRIGGER: Secure message updates (Prevent content spoofing by other users)
-- Although the RLS policy allows ANY authenticated user to update a message,
-- this trigger restricts what columns they can change. If you aren't the sender,
-- you can ONLY change non-core fields (like reactions or read_by).
CREATE OR REPLACE FUNCTION check_message_update_security()
RETURNS TRIGGER AS $$
BEGIN
  -- If the user is the original sender, they can update anything.
  IF auth.uid() = OLD.sender_id THEN
    RETURN NEW;
  END IF;

  -- Otherwise, verify core fields aren't being modified.
  IF OLD.id IS DISTINCT FROM NEW.id OR
     OLD.sender_id IS DISTINCT FROM NEW.sender_id OR
     OLD.content IS DISTINCT FROM NEW.content OR
     OLD.image_url IS DISTINCT FROM NEW.image_url OR
     OLD.created_at IS DISTINCT FROM NEW.created_at THEN
    RAISE EXCEPTION 'Unauthorized: You can only update reactions and read receipts on other users messages';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_message_update_security ON messages;
CREATE TRIGGER enforce_message_update_security
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION check_message_update_security();

-- STORAGE POLICIES (for bucket 'avatars' and 'media')
-- Allow public read access
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' OR bucket_id = 'media' );

-- Allow authenticated users to upload to media
-- CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK ( auth.role() = 'authenticated' );
