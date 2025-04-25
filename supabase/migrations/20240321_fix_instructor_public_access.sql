-- Drop all existing policies
DROP POLICY IF EXISTS "Public can view approved instructors" ON public.instructors;
DROP POLICY IF EXISTS "Allow public read access to approved instructors" ON public.instructors;
DROP POLICY IF EXISTS "Allow authenticated users to create instructor profiles" ON public.instructors;
DROP POLICY IF EXISTS "Allow users to create instructor profiles" ON public.instructors;
DROP POLICY IF EXISTS "Allow admin users to update instructors" ON public.instructors;
DROP POLICY IF EXISTS "Allow admin users to delete instructors" ON public.instructors;
DROP POLICY IF EXISTS "Allow admin users to view all instructors" ON public.instructors;
DROP POLICY IF EXISTS "Allow service role full access" ON public.instructors;
DROP POLICY IF EXISTS "Allow admin users full access" ON public.instructors;
DROP POLICY IF EXISTS "Allow users to view their own submissions" ON public.instructors;
DROP POLICY IF EXISTS "Allow public to create instructor profiles" ON public.instructors;
DROP POLICY IF EXISTS "Anyone can view approved instructors" ON public.instructors;
DROP POLICY IF EXISTS "Anyone can submit instructor applications" ON public.instructors;
DROP POLICY IF EXISTS "Admin users have full access" ON public.instructors;
DROP POLICY IF EXISTS "Service role has full access" ON public.instructors;

-- Enable RLS
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view approved instructors
CREATE POLICY "Anyone can view approved instructors"
ON public.instructors FOR SELECT
TO public
USING (status = 'approved');

-- 2. Anyone can submit new instructor applications
CREATE POLICY "Anyone can submit instructor applications"
ON public.instructors FOR INSERT
TO public
WITH CHECK (
  -- Ensure new submissions start as pending
  COALESCE(status, 'pending') = 'pending' AND
  -- Ensure they're not approved by default
  COALESCE(is_approved, false) = false
);

-- 3. Admin users have full access to manage instructors
CREATE POLICY "Admin users have full access"
ON public.instructors FOR ALL
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM admin_users)
)
WITH CHECK (
  auth.uid() IN (SELECT user_id FROM admin_users)
);

-- 4. Service role has full access (needed for backend operations)
CREATE POLICY "Service role has full access"
ON public.instructors FOR ALL
TO service_role
USING (true)
WITH CHECK (true); 