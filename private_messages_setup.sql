-- Create the private_messages table
CREATE TABLE private_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_contact TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on Row Level Security
ALTER TABLE private_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a message (so guests can send messages too)
CREATE POLICY "Anyone can send a private message"
  ON private_messages FOR INSERT
  WITH CHECK (true);

-- ONLY the Admin (Hisham) can read the messages.
CREATE POLICY "Only admin can view private messages"
  ON private_messages FOR SELECT
  USING ( EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()) );
  
CREATE POLICY "Only admin can update private messages"
  ON private_messages FOR UPDATE
  USING ( EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()) );

CREATE POLICY "Only admin can delete private messages"
  ON private_messages FOR DELETE
  USING ( EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()) );
