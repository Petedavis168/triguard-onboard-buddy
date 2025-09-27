import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Find user with matching username and password (phone number)
      const { data: user, error } = await supabase
        .from('onboarding_forms')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('user_password', password)
        .maybeSingle();

      if (error) {
        console.error('Database error:', error);
        setError('Login failed. Please check your credentials.');
        return;
      }
      
      if (!user) {
        setError('Invalid username or password');
        return;
      }

      // Store user session in localStorage
      localStorage.setItem('userAuthenticated', 'true');
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', `${user.first_name} ${user.last_name}`);
      localStorage.setItem('userEmail', user.generated_email || user.personal_email || '');
      
      toast({
        title: "Login Successful",
        description: `Welcome ${user.first_name}! Redirecting to your profile...`,
      });
      
      navigate('/user-dashboard');
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">TR</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Employee Login</CardTitle>
          <CardDescription>
            Access your employee profile and information
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="text-sm">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name (e.g., johnsmith)"
                className="min-h-[44px] text-base"
                required
              />
              <p className="text-xs text-muted-foreground">
                Your username is your first and last name combined (no spaces)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your phone number"
                className="min-h-[44px] text-base"
                inputMode="tel"
                required
              />
              <p className="text-xs text-muted-foreground">
                Your password is your phone number on file
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full min-h-[44px] text-base font-medium" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-muted-foreground pt-2">
              <p>Need help with login? Contact your manager</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;