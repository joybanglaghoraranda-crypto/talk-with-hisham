-- ============================================
-- SCHEMA UPDATE: Talk with Hisham v2.0
-- Run this AFTER the existing setup scripts
-- ============================================

-- 1. Add admin_reply columns to private_messages
ALTER TABLE private_messages ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE private_messages ADD COLUMN IF NOT EXISTS admin_reply_at TIMESTAMP WITH TIME ZONE;

-- 2. Add reply_to column to messages (for chat threading)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to UUID REFERENCES messages(id) ON DELETE SET NULL;

-- 3. Add reactions JSONB to posts (for multi-reaction feed)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '{}'::jsonb;

-- 4. Allow the sender to view their OWN private messages
-- (They need to see their messages + admin replies)
CREATE POLICY "Senders can view their own private messages"
  ON private_messages FOR SELECT
  USING (
    auth.uid() = sender_id
    OR (auth.jwt() ->> 'email') = 'ibnenurakondo@gmail.com'
  );
-- NOTE: If the old "Only admin can view" policy exists, DROP it first:
-- DROP POLICY IF EXISTS "Only admin can view private messages" ON private_messages;

-- 5. Allow admin to select all profiles (already public, but ensure)
-- profiles SELECT policy already allows everyone, so no change needed.

-- 6. Update policy for posts to allow reaction updates
-- The existing "Authenticated users can update post likes" from comments_setup.sql
-- should already cover this since reactions is just another column on posts.

-- ============================================
-- REALTIME: Enable realtime for private_messages
-- ============================================
-- In Supabase Dashboard > Database > Replication, enable the private_messages table
-- Or run:
-- ALTER PUBLICATION supabase_realtime ADD TABLE private_messages;
