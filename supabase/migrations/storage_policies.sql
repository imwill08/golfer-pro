-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Give public access to instructorsimages" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to instructorsimages" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to instructorsimages" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from instructorsimages" ON storage.objects;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public access to view files
CREATE POLICY "Give public access to instructorsimages"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'instructorsimages');

-- Allow any authenticated user to upload files
CREATE POLICY "Allow authenticated uploads to instructorsimages"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'instructorsimages');

-- Allow any authenticated user to update files
CREATE POLICY "Allow authenticated updates to instructorsimages"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'instructorsimages');

-- Allow any authenticated user to delete files
CREATE POLICY "Allow authenticated deletes from instructorsimages"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'instructorsimages');

-- Grant necessary permissions to authenticated users
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated; 