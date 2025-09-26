import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleBackToHome = () => {
    console.log('Back to Home button clicked from Admin Login');
    navigate('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: rpcError } = await supabase
        .rpc('authenticate_admin', {
          admin_email: email,
          admin_password: password
        });

      if (rpcError || !data || data.length === 0) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      const adminData = data[0];

      // Store admin data
      localStorage.setItem('adminData', JSON.stringify(adminData));
      localStorage.setItem('adminEmail', adminData.email);

      if (adminData.force_password_change) {
        // Store temporary auth for password change
        localStorage.setItem('adminTempAuth', 'true');
        toast({
          title: "Password Change Required",
          description: "You must change your password before accessing the dashboard",
        });
        navigate('/admin-password-change');
      } else {
        // Update last activity
        await supabase
          .from('admin_users')
          .update({
            last_login_at: new Date().toISOString(),
            last_activity_at: new Date().toISOString()
          })
          .eq('id', adminData.id);

        localStorage.setItem('adminAuthenticated', 'true');
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard",
        });
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 hover:shadow-md transition-all duration-200"
            onClick={handleBackToHome}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Access the TriGuard Roofing admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@triguardroofing.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;