-- Drop old bucket if exists
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Owners can update and delete their photos" ON storage.objects;
DROP POLICY IF EXISTS "Owners can delete their photos" ON storage.objects;

-- Drop old policies for instructorsimages
DROP POLICY IF EXISTS "Give public access to instructorsimages" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to instructorsimages" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to instructorsimages" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from instructorsimages" ON storage.objects;

-- Create instructorsimages bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('instructorsimages', 'instructorsimages', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for instructorsimages bucket
-- Allow public read access
CREATE POLICY "Give public access to instructorsimages"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'instructorsimages');

-- Allow public to upload files (no auth required)
CREATE POLICY "Allow public uploads to instructorsimages"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'instructorsimages');

-- Allow public to update their own files
CREATE POLICY "Allow public updates to instructorsimages"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'instructorsimages');

-- Allow public to delete their own files
CREATE POLICY "Allow public deletes from instructorsimages"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'instructorsimages');

-- Grant necessary permissions to public role
GRANT ALL ON storage.objects TO public;
GRANT ALL ON storage.buckets TO public; 