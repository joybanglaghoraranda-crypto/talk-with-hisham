-- ============================================
-- FIX: Private Messages Reply + RLS Policies
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Ensure admin_reply columns exist
ALTER TABLE private_messages ADD COLUMN IF NOT EXISTS admin_reply TEXT;
ALTER TABLE private_messages ADD COLUMN IF NOT EXISTS admin_reply_at TIMESTAMP WITH TIME ZONE;

-- 2. Drop ALL existing policies on private_messages to avoid conflicts
DROP POLICY IF EXISTS "Anyone can send a private message" ON private_messages;
DROP POLICY IF EXISTS "Only admin can view private messages" ON private_messages;
DROP POLICY IF EXISTS "Only admin can update private messages" ON private_messages;
DROP POLICY IF EXISTS "Only admin can delete private messages" ON private_messages;
DROP POLICY IF EXISTS "Senders can view their own private messages" ON private_messages;

-- 3. Re-create clean policies

-- Allow any authenticated user to INSERT (send a message)
CREATE POLICY "Anyone can send a private message"
  ON private_messages FOR INSERT
  WITH CHECK (true);

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

-- 4. Ensure RLS is enabled
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;
