
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
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
  
  // Only check authentication if a role is required
  // For regular routes, we don't need any authentication
  if (requiredRole) {
    // Redirect to homepage if not authenticated
    if (!user) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
    
    // If admin role is required, check if user is admin
    if (requiredRole === 'admin' && !isAdmin) {
      return <Navigate to="/" replace />;
    }
  }
  
  // User has the required role (or no role is required), render the protected content
  return <>{children}</>;
};
