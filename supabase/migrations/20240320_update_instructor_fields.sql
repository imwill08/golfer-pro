-- Add new columns and rename existing ones
ALTER TABLE public.instructors
-- Add new gallery_photos column
ADD COLUMN IF NOT EXISTS gallery_photos TEXT[] DEFAULT '{}'::TEXT[],
-- Add lesson_types as JSONB (this will store the detailed lesson type information)
ADD COLUMN IF NOT EXISTS lesson_types JSONB DEFAULT '[]'::JSONB;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_instructors_gallery_photos ON public.instructors USING GIN(gallery_photos);
CREATE INDEX IF NOT EXISTS idx_instructors_lesson_types ON public.instructors USING GIN(lesson_types);

-- Migrate existing services data to lesson_types if needed
DO $$
BEGIN
    -- Only attempt migration if services column exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'instructors'
        AND column_name = 'services'
    ) THEN
        -- Update lesson_types with existing services data
        UPDATE public.instructors
        SET lesson_types = services
        WHERE services IS NOT NULL;
        
        -- Optionally, you can drop the services column after migration
        -- ALTER TABLE public.instructors DROP COLUMN services;
    END IF;
END $$;

-- Update the faqs column to ensure it's JSONB and has the correct default
ALTER TABLE public.instructors 
ALTER COLUMN faqs SET DEFAULT '[]'::JSONB,
ALTER COLUMN faqs SET DATA TYPE JSONB USING COALESCE(faqs, '[]'::JSONB);

-- Create or update trigger function to handle the new fields
CREATE OR REPLACE FUNCTION update_instructor_computed_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the name field
    NEW.name := NEW.first_name || ' ' || NEW.last_name;
    
    -- Update the location field
    NEW.location := NEW.city || ', ' || NEW.state || ', ' || NEW.country;
    
    -- Update the contact_info JSON
    NEW.contact_info := jsonb_build_object(
        'email', NEW.email,
        'phone', COALESCE(NEW.phone, ''),
        'website', COALESCE(NEW.website, '')
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Make sure the trigger is updated
DROP TRIGGER IF EXISTS update_instructor_computed_fields_trigger ON public.instructors;
CREATE TRIGGER update_instructor_computed_fields_trigger
    BEFORE INSERT OR UPDATE ON public.instructors
    FOR EACH ROW
    EXECUTE FUNCTION update_instructor_computed_fields();

-- Add comments to document the changes
COMMENT ON COLUMN public.instructors.lesson_types IS 'Stores detailed lesson type information in JSONB format';
COMMENT ON COLUMN public.instructors.gallery_photos IS 'Array of URLs for instructor gallery photos';
COMMENT ON COLUMN public.instructors.photos IS 'Array of URLs for instructor profile photos'; 