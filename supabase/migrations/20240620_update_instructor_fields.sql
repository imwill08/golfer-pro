-- Add gallery_photos and update lesson_types related columns
ALTER TABLE public.instructors
-- Add gallery_photos column as TEXT array with empty default
ADD COLUMN IF NOT EXISTS gallery_photos TEXT[] DEFAULT '{}'::TEXT[],
-- Add lesson_types_data as JSONB to store detailed lesson type information
ADD COLUMN IF NOT EXISTS lesson_types_data JSONB DEFAULT '[]'::JSONB;

-- Create indexes for new columns for better query performance
CREATE INDEX IF NOT EXISTS idx_instructors_gallery_photos ON public.instructors USING GIN(gallery_photos);
CREATE INDEX IF NOT EXISTS idx_instructors_lesson_types ON public.instructors USING GIN(lesson_types_data);

-- Migrate data from services to lesson_types_data (if services column exists)
DO $$
BEGIN
    -- Only attempt migration if services column exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'instructors'
        AND column_name = 'services'
    ) THEN
        -- Update lesson_types_data with existing services data
        UPDATE public.instructors
        SET lesson_types_data = services
        WHERE services IS NOT NULL AND services != '[]'::JSONB;
        
        -- Note: We're not dropping the services column immediately to ensure backward compatibility
        -- You can drop it later with: ALTER TABLE public.instructors DROP COLUMN services;
    END IF;
END $$;

-- Add comments to document the columns
COMMENT ON COLUMN public.instructors.gallery_photos IS 'Stores URLs for instructor gallery photos (teaching, action shots, etc.)';
COMMENT ON COLUMN public.instructors.lesson_types IS 'Stores detailed information about lesson types including price, duration, description';
COMMENT ON COLUMN public.instructors.photos IS 'Stores URLs for instructor profile photos'; 