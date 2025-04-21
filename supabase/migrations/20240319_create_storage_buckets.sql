-- Create a new bucket for instructor photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('instructor-photos', 'instructor-photos', true);

-- Set up storage policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'instructor-photos');

CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'instructor-photos');

CREATE POLICY "Owners can update and delete their photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'instructor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owners can delete their photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'instructor-photos' AND auth.uid()::text = (storage.foldername(name))[1]); 