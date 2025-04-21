
import { supabase } from '@/integrations/supabase/client';

// Centralized admin emails list
const ADMIN_EMAILS = ['admin@example.com', 'tabrejalam786007@gmail.com'];

/**
 * Checks if the current user has admin access
 * This is the single source of truth for admin verification
 */
export const checkAdminAccess = async (): Promise<boolean> => {
  try {
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session, user is not logged in
    if (!session) return false;
    
    // Check admin status via email - making sure to trim and lowercase for case-insensitive comparison
    const userEmail = session.user.email?.toLowerCase().trim();
    
    // Only log admin checks when in admin routes
    if (window.location.pathname.startsWith('/admin')) {
      console.log('Admin check for email:', userEmail);
    }
    
    const isAdminByEmail = userEmail ? ADMIN_EMAILS.includes(userEmail) : false;
    
    return isAdminByEmail;
  } catch (error) {
    if (window.location.pathname.startsWith('/admin')) {
      console.error('Error checking admin access:', error);
    }
    return false;
  }
};

/**
 * Handles admin-only data fetching with proper error handling
 */
export const fetchAdminData = async <T>(
  fetchFunction: () => Promise<T>
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    // Check admin access first
    const isAdmin = await checkAdminAccess();
    
    if (!isAdmin) {
      return {
        data: null,
        error: new Error('Unauthorized: Admin access required')
      };
    }
    
    // If admin, proceed with the fetch
    const result = await fetchFunction();
    return {
      data: result,
      error: null
    };
  } catch (error) {
    console.error('Error in admin data fetch:', error);
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    };
  }
};

// Export admin emails for reference if needed
export { ADMIN_EMAILS };
