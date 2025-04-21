-- Check the number of instructors
SELECT COUNT(*) as total_instructors FROM public.instructors;

-- Check the instructors' basic info
SELECT 
    name,
    location,
    specialization,
    status
FROM public.instructors
ORDER BY created_at DESC; 