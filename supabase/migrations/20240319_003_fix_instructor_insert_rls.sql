-- Drop existing insert policy
DROP POLICY IF EXISTS "Allow users to create instructor profiles" ON public.instructors;
DROP POLICY IF EXISTS "Allow authenticated users to create instructor profiles" ON public.instructors;

-- Create a new, more permissive insert policy for authenticated users
CREATE POLICY "Allow authenticated users to create instructor profiles"
ON public.instructors
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own pending submissions
CREATE POLICY "Allow users to view their own submissions"
ON public.instructors
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
    OR
    auth.uid() IN (SELECT user_id FROM admin_users)
    OR
    status = 'approved'
); 