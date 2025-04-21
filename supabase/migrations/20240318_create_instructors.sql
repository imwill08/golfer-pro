-- Create the instructors table with enhanced fields matching the form
CREATE TABLE public.instructors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Personal Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    name TEXT NOT NULL, -- Will be updated via trigger
    email TEXT NOT NULL,
    phone TEXT,
    website TEXT,
    
    -- Location Information
    country TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    location TEXT NOT NULL, -- Will be updated via trigger
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    
    -- Professional Information
    experience INTEGER NOT NULL,
    tagline TEXT,
    specialization TEXT NOT NULL,
    bio TEXT NOT NULL,
    additional_bio TEXT,
    
    -- Arrays and JSON fields
    specialties TEXT[] DEFAULT '{}'::TEXT[],
    certifications TEXT[] DEFAULT '{}'::TEXT[],
    lesson_types TEXT[] DEFAULT '{}'::TEXT[],
    highlights TEXT[] DEFAULT '{}'::TEXT[],
    photos TEXT[] DEFAULT '{}'::TEXT[],
    
    -- Structured JSON fields
    services JSONB DEFAULT '[]'::JSONB,
    faqs JSONB DEFAULT '[]'::JSONB,
    contact_info JSONB DEFAULT '{}'::JSONB,
    
    -- Admin fields
    is_approved BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    
    -- Metadata
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    profile_views INTEGER DEFAULT 0,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to update name and location
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

-- Create the trigger
CREATE TRIGGER update_instructor_computed_fields_trigger
    BEFORE INSERT OR UPDATE ON public.instructors
    FOR EACH ROW
    EXECUTE FUNCTION update_instructor_computed_fields();

-- Create indexes for common queries
CREATE INDEX idx_instructors_status ON public.instructors(status);
CREATE INDEX idx_instructors_location ON public.instructors(location);
CREATE INDEX idx_instructors_created_at ON public.instructors(created_at);
CREATE INDEX idx_instructors_specialties ON public.instructors USING GIN(specialties);
CREATE INDEX idx_instructors_certifications ON public.instructors USING GIN(certifications);
CREATE INDEX idx_instructors_lesson_types ON public.instructors USING GIN(lesson_types);

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow admin users to view admin_users table
CREATE POLICY "Allow admin users to view admin_users"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Set up Row Level Security (RLS) for instructors
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

-- Create policies for instructors
-- Allow anyone to read approved instructors
CREATE POLICY "Allow public read access to approved instructors" 
    ON public.instructors FOR SELECT 
    USING (status = 'approved');

-- Allow authenticated users to create instructor profiles
CREATE POLICY "Allow authenticated users to create instructor profiles" 
    ON public.instructors FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Allow admin users to update instructors
CREATE POLICY "Allow admin users to update instructors"
    ON public.instructors FOR UPDATE
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users))
    WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));

-- Allow admin users to delete instructors
CREATE POLICY "Allow admin users to delete instructors"
    ON public.instructors FOR DELETE
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Allow admin users to view all instructors
CREATE POLICY "Allow admin users to view all instructors"
    ON public.instructors FOR SELECT
    TO authenticated
    USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Insert sample data with the new structure
INSERT INTO public.instructors (
    first_name,
    last_name,
    email,
    phone,
    website,
    country,
    state,
    city,
    postal_code,
    latitude,
    longitude,
    experience,
    specialization,
    bio,
    additional_bio,
    specialties,
    certifications,
    lesson_types,
    highlights,
    photos,
    services,
    faqs,
    status,
    tagline
) VALUES
(
    'John',
    'Smith',
    'john.smith@golfpro.com',
    '(555) 123-4567',
    'www.johnsmithgolf.com',
    'USA',
    'FL',
    'Orlando',
    '32801',
    28.5383,
    -81.3792,
    15,
    'Advanced Golf Instruction',
    'PGA Professional with over 15 years of teaching experience. Specialized in helping golfers of all skill levels achieve their goals.',
    'Former PGA Tour player turned instructor, dedicated to sharing my knowledge and passion for the game.',
    ARRAY['Private Lessons', 'Group Coaching', 'Junior Development'],
    ARRAY['PGA Certified', 'TPI Level 3', 'US Kids Certified'],
    ARRAY['privateLesson', 'groupLessons', 'juniorCoaching'],
    ARRAY['Former PGA Tour Player', 'Award-winning instructor', '1000+ students taught'],
    ARRAY['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop'],
    '[
        {
            "title": "Private Lesson",
            "description": "One-on-one personalized instruction",
            "duration": "1 hour",
            "price": "$150"
        },
        {
            "title": "Group Clinic",
            "description": "Small group instruction (max 4 players)",
            "duration": "2 hours",
            "price": "$75 per person"
        }
    ]'::jsonb,
    '[
        {
            "question": "Do I need my own equipment?",
            "answer": "While having your own clubs is recommended, I can provide equipment for beginners."
        },
        {
            "question": "How many lessons do you recommend?",
            "answer": "I typically recommend a series of 5-6 lessons to see significant improvement."
        }
    ]'::jsonb,
    'approved',
    'Transforming golf games for over 15 years'
);

-- Add more sample instructors
INSERT INTO public.instructors (
    first_name,
    last_name,
    email,
    phone,
    website,
    country,
    state,
    city,
    postal_code,
    latitude,
    longitude,
    experience,
    specialization,
    bio,
    additional_bio,
    specialties,
    certifications,
    lesson_types,
    highlights,
    photos,
    services,
    faqs,
    status,
    tagline
) VALUES
(
    'Sarah',
    'Johnson',
    'sarah.johnson@golfpro.com',
    '(555) 987-6543',
    'www.sarahjohnsongolf.com',
    'USA',
    'FL',
    'Tampa',
    '33601',
    27.9506,
    -82.4572,
    8,
    'Short Game Specialist',
    'LPGA Teaching Professional specializing in short game improvement and women''s golf instruction.',
    'Former collegiate golfer turned instructor, passionate about growing women''s participation in golf.',
    ARRAY['Short Game', 'Putting', 'Women''s Golf', 'Beginner Friendly'],
    ARRAY['LPGA Certified', 'Vision54 Coach', 'US Kids Certified'],
    ARRAY['privateLesson', 'groupLessons', 'juniorCoaching'],
    ARRAY['LPGA Teaching Professional', 'College Golf Coach', 'Short Game Expert'],
    ARRAY['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop'],
    '[
        {
            "title": "Short Game Mastery",
            "description": "Focused instruction on putting, chipping, and pitching",
            "duration": "1 hour",
            "price": "$125"
        },
        {
            "title": "Women''s Group Clinic",
            "description": "Fun and supportive group environment for women golfers",
            "duration": "2 hours",
            "price": "$60 per person"
        }
    ]'::jsonb,
    '[
        {
            "question": "Do you offer women-only clinics?",
            "answer": "Yes, I specialize in women''s golf instruction and regularly host women-only group clinics."
        },
        {
            "question": "What''s your teaching philosophy?",
            "answer": "I believe in creating a comfortable, supportive environment where students can learn at their own pace."
        }
    ]'::jsonb,
    'approved',
    'Making golf accessible and enjoyable for everyone'
),
(
    'Michael',
    'Chen',
    'michael.chen@golfpro.com',
    '(555) 234-5678',
    'www.michaelchengolf.com',
    'USA',
    'CA',
    'San Diego',
    '92101',
    32.7157,
    -117.1611,
    12,
    'Performance Coach & Club Fitting Expert',
    'Combining modern technology with traditional teaching methods to help golfers reach their full potential.',
    'Certified club fitter and performance coach using data-driven approach to improve your game.',
    ARRAY['Club Fitting', 'Swing Analysis', 'Performance Training', 'Advanced Technology'],
    ARRAY['PGA Certified', 'Trackman Certified', 'Club Fitting Specialist'],
    ARRAY['privateLesson', 'advancedTraining', 'onlineCoaching'],
    ARRAY['TrackMan Master', 'Custom Club Fitter', 'Performance Specialist'],
    ARRAY['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop'],
    '[
        {
            "title": "Tech Analysis Session",
            "description": "Complete swing analysis using TrackMan and high-speed cameras",
            "duration": "90 minutes",
            "price": "$200"
        },
        {
            "title": "Club Fitting",
            "description": "Comprehensive club fitting session with all major brands",
            "duration": "2 hours",
            "price": "$250"
        }
    ]'::jsonb,
    '[
        {
            "question": "What technology do you use?",
            "answer": "I use TrackMan 4, high-speed cameras, and pressure plates for comprehensive analysis."
        },
        {
            "question": "What brands do you offer for club fitting?",
            "answer": "I work with all major brands including Titleist, TaylorMade, Callaway, and PING."
        }
    ]'::jsonb,
    'approved',
    'Data-driven improvement for the modern golfer'
),
(
    'David',
    'Martinez',
    'david.martinez@golfpro.com',
    '(555) 345-6789',
    'www.davidmartinezgolf.com',
    'USA',
    'AZ',
    'Scottsdale',
    '85251',
    33.4942,
    -111.9261,
    20,
    'Mental Game & Course Management',
    'Former tour player specializing in mental game coaching and strategic course management.',
    'Helping players of all levels develop a stronger mental game and better decision-making on the course.',
    ARRAY['Mental Game', 'Course Strategy', 'Tournament Prep', 'Elite Training'],
    ARRAY['PGA Master Professional', 'Mental Game Certified', 'Tournament Player'],
    ARRAY['privateLesson', 'oncourseInstruction', 'advancedTraining'],
    ARRAY['Former Tour Player', 'Mental Game Expert', 'Strategic Play Specialist'],
    ARRAY['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop'],
    '[
        {
            "title": "Mental Game Session",
            "description": "Focus on mental strategies and pre-shot routines",
            "duration": "1 hour",
            "price": "$175"
        },
        {
            "title": "On-Course Strategy",
            "description": "Real-world application of course management principles",
            "duration": "3 hours",
            "price": "$350"
        }
    ]'::jsonb,
    '[
        {
            "question": "Do you work with tournament players?",
            "answer": "Yes, I specialize in preparing players for tournament competition at all levels."
        },
        {
            "question": "What''s included in mental game training?",
            "answer": "We cover pre-shot routines, emotional control, focus techniques, and strategic decision-making."
        }
    ]'::jsonb,
    'approved',
    'Master your mental game, master the course'
),
(
    'Emma',
    'Wilson',
    'emma.wilson@golfpro.com',
    '(555) 456-7890',
    'www.emmawilsongolf.com',
    'USA',
    'TX',
    'Austin',
    '78701',
    30.2672,
    -97.7431,
    6,
    'Junior Golf Development',
    'Passionate about developing young golfers through fun and engaging instruction.',
    'Creating positive first experiences in golf for juniors of all ages and abilities.',
    ARRAY['Junior Golf', 'Beginner Friendly', 'Family Golf', 'Group Programs'],
    ARRAY['US Kids Certified', 'PGA Junior Coach', 'First Tee Certified'],
    ARRAY['juniorCoaching', 'groupLessons', 'privateLesson'],
    ARRAY['Junior Golf Specialist', 'Program Director', 'Youth Development Expert'],
    ARRAY['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop'],
    '[
        {
            "title": "Junior Private Lesson",
            "description": "Age-appropriate instruction for young golfers",
            "duration": "45 minutes",
            "price": "$75"
        },
        {
            "title": "Junior Golf Camp",
            "description": "Week-long summer camp for ages 7-14",
            "duration": "Half day",
            "price": "$299 per week"
        }
    ]'::jsonb,
    '[
        {
            "question": "What age groups do you teach?",
            "answer": "I work with juniors from ages 5-17, with programs tailored to each age group."
        },
        {
            "question": "Do you provide equipment?",
            "answer": "Yes, we have properly sized junior clubs available for all lessons and camps."
        }
    ]'::jsonb,
    'approved',
    'Growing the game one junior golfer at a time'
); 