-- Check if approved column exists and rename it to is_approved if it does
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'instructors'
        AND column_name = 'approved'
    ) THEN
        ALTER TABLE instructors RENAME COLUMN approved TO is_approved;
    END IF;
END $$;

-- Add is_approved column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'instructors'
        AND column_name = 'is_approved'
    ) THEN
        ALTER TABLE instructors ADD COLUMN is_approved BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Update RLS policies
DROP POLICY IF EXISTS "Public can view approved instructors" ON public.instructors;
CREATE POLICY "Public can view approved instructors" 
ON public.instructors
FOR SELECT 
TO public
USING (is_approved = true);

-- Service role policy
DROP POLICY IF EXISTS "Service role can manage all instructors" ON public.instructors;
CREATE POLICY "Service role can manage all instructors"
ON public.instructors
TO service_role
USING (true)
WITH CHECK (true);

-- Admin role policy
DROP POLICY IF EXISTS "Admin users can manage all instructors" ON public.instructors;
CREATE POLICY "Admin users can manage all instructors"
ON public.instructors
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM admin_users))
WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users)); 