-- ============================================
-- FIX: Private Messages Reply + RLS Policies
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create the private_messages table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS private_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_contact TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ensure admin_reply columns exist
ALTER TABLE private_messages ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE private_messages ADD COLUMN IF NOT EXISTS admin_reply_at TIMESTAMP WITH TIME ZONE;

-- 3. Drop ALL existing policies on private_messages to avoid conflicts
DROP POLICY IF EXISTS "Anyone can send a private message" ON private_messages;
DROP POLICY IF EXISTS "Authenticated users can send a private message" ON private_messages;
DROP POLICY IF EXISTS "Only admin can view private messages" ON private_messages;
DROP POLICY IF EXISTS "Only admin can update private messages" ON private_messages;
DROP POLICY IF EXISTS "Only admin can delete private messages" ON private_messages;
DROP POLICY IF EXISTS "Senders can view their own private messages" ON private_messages;
DROP POLICY IF EXISTS "Users and admin can view private messages" ON private_messages;
DROP POLICY IF EXISTS "Admin can update private messages" ON private_messages;
DROP POLICY IF EXISTS "Admin can delete private messages" ON private_messages;

-- 4. Turn on Row Level Security
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

-- 5. Re-create clean policies

-- Allow authenticated users to send a private message (ensuring they only send as themselves)
CREATE POLICY "Authenticated users can send a private message"
  ON private_messages FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = sender_id);

-- Allow admin to see ALL messages, and users to see ONLY their own
CREATE POLICY "Users and admin can view private messages"
  ON private_messages FOR SELECT
  USING (
    auth.uid() = sender_id
    OR (auth.jwt() ->> 'email') = 'ibnenurakondo@gmail.com'
  );

-- Allow ONLY admin to update (for replying)
CREATE POLICY "Admin can update private messages"
  ON private_messages FOR UPDATE
  USING (
    (auth.jwt() ->> 'email') = 'ibnenurakondo@gmail.com'
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') = 'ibnenurakondo@gmail.com'
  );

-- Allow ONLY admin to delete
CREATE POLICY "Admin can delete private messages"
  ON private_messages FOR DELETE
  USING (
    (auth.jwt() ->> 'email') = 'ibnenurakondo@gmail.com'
  );
