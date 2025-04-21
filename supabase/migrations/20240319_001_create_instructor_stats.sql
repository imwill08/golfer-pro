-- Create instructor_stats table
CREATE TABLE IF NOT EXISTS public.instructor_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instructor_id UUID REFERENCES public.instructors(id) ON DELETE CASCADE,
    profile_views INTEGER DEFAULT 0,
    contact_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(instructor_id)
);

-- Create contact_click_logs table for detailed tracking
CREATE TABLE IF NOT EXISTS public.contact_click_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instructor_id UUID REFERENCES public.instructors(id) ON DELETE CASCADE,
    click_type TEXT NOT NULL, -- email, phone, website, instagram, youtube, facebook
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_instructor_stats_instructor_id ON public.instructor_stats(instructor_id);
CREATE INDEX IF NOT EXISTS idx_contact_click_logs_instructor_id ON public.contact_click_logs(instructor_id);
CREATE INDEX IF NOT EXISTS idx_contact_click_logs_created_at ON public.contact_click_logs(created_at);

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS increment_profile_views(UUID);
DROP FUNCTION IF EXISTS increment_contact_clicks(UUID, TEXT);

-- Create function to increment profile views
CREATE OR REPLACE FUNCTION increment_profile_views(instructor_uuid UUID)
RETURNS void AS $$
BEGIN
    -- Check if stats record exists
    IF EXISTS (SELECT 1 FROM public.instructor_stats WHERE instructor_id = instructor_uuid) THEN
        -- Update existing record
        UPDATE public.instructor_stats
        SET profile_views = profile_views + 1,
            updated_at = NOW()
        WHERE instructor_id = instructor_uuid;
    ELSE
        -- Create new record
        INSERT INTO public.instructor_stats (instructor_id, profile_views, contact_clicks)
        VALUES (instructor_uuid, 1, 0);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment contact clicks
CREATE OR REPLACE FUNCTION increment_contact_clicks(instructor_uuid UUID, click_type TEXT)
RETURNS void AS $$
BEGIN
    -- Check if stats record exists
    IF EXISTS (SELECT 1 FROM public.instructor_stats WHERE instructor_id = instructor_uuid) THEN
        -- Update existing record
        UPDATE public.instructor_stats
        SET contact_clicks = contact_clicks + 1,
            updated_at = NOW()
        WHERE instructor_id = instructor_uuid;
    ELSE
        -- Create new record
        INSERT INTO public.instructor_stats (instructor_id, profile_views, contact_clicks)
        VALUES (instructor_uuid, 0, 1);
    END IF;
    
    -- Log the click
    INSERT INTO public.contact_click_logs (instructor_id, click_type)
    VALUES (instructor_uuid, click_type);
END;
$$ LANGUAGE plpgsql;

-- Set up Row Level Security (RLS)
ALTER TABLE public.instructor_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_click_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for instructor_stats
CREATE POLICY "Allow public read access to instructor stats" 
    ON public.instructor_stats FOR SELECT 
    USING (true);

CREATE POLICY "Allow public to update instructor stats" 
    ON public.instructor_stats FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create policies for contact_click_logs
CREATE POLICY "Allow public read access to contact click logs" 
    ON public.contact_click_logs FOR SELECT 
    USING (true);

CREATE POLICY "Allow public to insert contact click logs" 
    ON public.contact_click_logs FOR INSERT
    WITH CHECK (true);

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Allow service role to update instructor stats" ON public.instructor_stats;
DROP POLICY IF EXISTS "Allow service role to insert contact click logs" ON public.contact_click_logs; 