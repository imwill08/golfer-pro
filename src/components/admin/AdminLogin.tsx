import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, testSupabaseConnection } from '@/integrations/supabase/client';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const { success, error } = await testSupabaseConnection();
    if (success) {
      setConnectionStatus('connected');
      setConnectionError(null);
    } else {
      setConnectionStatus('error');
      setConnectionError(error || 'Failed to connect to the server');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionStatus !== 'connected') {
      toast.error('Cannot login while disconnected from server');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Login successful');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Admin Login
            {connectionStatus === 'checking' && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
            {connectionStatus === 'connected' && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            {connectionStatus === 'error' && (
              <AlertCircle className="h-5 w-5 text-destructive" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connectionStatus === 'error' && (
            <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <p>Connection Error: {connectionError}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={checkConnection}
              >
                Retry Connection
              </Button>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={connectionStatus !== 'connected' || loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={connectionStatus !== 'connected' || loading}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={connectionStatus !== 'connected' || loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 