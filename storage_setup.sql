-- Create the storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;

-- Set up security policies for Avatars
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Users can upload their own avatars."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

CREATE POLICY "Users can update their own avatars."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Set up security policies for Media (Feed & Chat)
CREATE POLICY "Media is publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'media' );

CREATE POLICY "Authenticated users can upload media."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'media' AND auth.role() = 'authenticated' );
