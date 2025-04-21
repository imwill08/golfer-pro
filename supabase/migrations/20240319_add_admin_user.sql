-- Function to safely add an admin user if they don't already exist
CREATE OR REPLACE FUNCTION add_admin_user(user_id_param UUID)
RETURNS void AS $$
BEGIN
    -- Check if the user is already an admin
    IF NOT EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE user_id = user_id_param
    ) THEN
        -- Insert the new admin user
        INSERT INTO public.admin_users (user_id)
        VALUES (user_id_param);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Add your user as an admin (replace with your actual user ID)
SELECT add_admin_user('your-user-id-here'::UUID);

-- Drop the function as we don't need it anymore
DROP FUNCTION add_admin_user(UUID); 