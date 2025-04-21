-- Drop existing table and related objects if they exist
DROP TRIGGER IF EXISTS update_instructor_computed_fields_trigger ON public.instructors;
DROP FUNCTION IF EXISTS update_instructor_computed_fields();
DROP TABLE IF EXISTS public.instructors;

-- Verify the table is dropped
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'instructors'
); 