
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  
  // If user is not admin, show toast message and redirect to homepage
  if (!isAdmin) {
    // Move toast outside of render to avoid React warnings
    useEffect(() => {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive",
      });
      // Only log this message when actually trying to access admin routes
      console.log('Access denied: User is not an admin');
    }, []);
    
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has admin role
  return <>{children}</>;
};

export default AdminProtectedRoute;
