-- Get John Smith's instructor ID
SELECT id FROM public.instructors WHERE first_name = 'John' AND last_name = 'Smith';

-- Test increment_profile_views function
SELECT increment_profile_views('INSTRUCTOR_ID_HERE');

-- Test increment_contact_clicks function
SELECT increment_contact_clicks('INSTRUCTOR_ID_HERE', 'email');

-- Verify the stats were recorded
SELECT i.name, s.profile_views, s.contact_clicks
FROM public.instructors i
LEFT JOIN public.instructor_stats s ON i.id = s.instructor_id
WHERE i.first_name = 'John' AND i.last_name = 'Smith';

-- Check the contact click logs
SELECT cl.click_type, cl.created_at
FROM public.contact_click_logs cl
JOIN public.instructors i ON i.id = cl.instructor_id
WHERE i.first_name = 'John' AND i.last_name = 'Smith'
ORDER BY cl.created_at DESC; 