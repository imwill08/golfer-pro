import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Test Supabase connection on mount
  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('error');
          toast({
            title: 'Connection Error',
            description: 'Unable to connect to authentication service. Please try again later.',
            variant: 'destructive',
          });
        } else {
          setConnectionStatus('success');
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
        setConnectionStatus('error');
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to authentication service. Please try again later.',
          variant: 'destructive',
        });
      }
    }
    testConnection();
  }, []);

  // Check if already logged in and admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionStatus === 'error') {
      toast({
        title: 'Connection Error',
        description: 'Please wait for the connection to be established.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: 'Login Failed',
          description: error.message || 'Invalid credentials',
          variant: 'destructive',
        });
      } else {
        // Show login success toast
        toast({
          title: 'Login Successful',
          description: 'Welcome to the admin dashboard',
        });
        
        // Add explicit navigation to admin dashboard
        // This helps ensure redirection even if the useEffect doesn't trigger immediately
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      }
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: 'Login Failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-16 pb-8">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <Lock size={28} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-center text-gray-500 mb-6">
            This login is restricted to admin users only
          </p>
          
          {connectionStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">Connection Error</p>
                <p>Unable to connect to the authentication service. Please check your internet connection and try again.</p>
              </div>
            </div>
          )}
          
          {connectionStatus === 'testing' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
              <p className="text-sm text-blue-700">Testing connection...</p>
            </div>
          )}
          
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
            <AlertCircle size={20} className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <p className="font-medium">Note:</p>
              <p>Instructors and visitors don't need to log in. This platform is for admin management only.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="username"
                required
                disabled={connectionStatus !== 'success'}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={connectionStatus !== 'success'}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || connectionStatus !== 'success'}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn size={18} className="mr-2" />
                  Admin Login
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
