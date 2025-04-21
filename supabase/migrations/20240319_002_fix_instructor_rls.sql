-- Drop all existing policies for instructors table
DROP POLICY IF EXISTS "Public can view approved instructors" ON public.instructors;
DROP POLICY IF EXISTS "Allow public read access to approved instructors" ON public.instructors;
DROP POLICY IF EXISTS "Allow authenticated users to create instructor profiles" ON public.instructors;
DROP POLICY IF EXISTS "Allow admin users to update instructors" ON public.instructors;
DROP POLICY IF EXISTS "Allow admin users to delete instructors" ON public.instructors;
DROP POLICY IF EXISTS "Allow admin users to view all instructors" ON public.instructors;
DROP POLICY IF EXISTS "Service role can manage all instructors" ON public.instructors;
DROP POLICY IF EXISTS "Admin users can manage all instructors" ON public.instructors;

-- Create new, simplified policies

-- Allow public to view approved instructors
CREATE POLICY "Allow public to view approved instructors"
ON public.instructors
FOR SELECT
TO public
USING (status = 'approved');

-- Allow admin users full access to all instructors
CREATE POLICY "Allow admin users full access"
ON public.instructors
FOR ALL
TO authenticated
USING (
    auth.uid() IN (
        SELECT user_id 
        FROM public.admin_users
    )
)
WITH CHECK (
    auth.uid() IN (
        SELECT user_id 
        FROM public.admin_users
    )
);

-- Allow authenticated users to create their own instructor profiles
CREATE POLICY "Allow users to create instructor profiles"
ON public.instructors
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access"
ON public.instructors
FOR ALL
TO service_role
USING (true)
WITH CHECK (true); 