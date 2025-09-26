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
        .single();

      if (error || !user) {
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
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Employee Login</CardTitle>
          <CardDescription>
            Access your employee profile and information
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name (e.g., johnsmith)"
                required
              />
              <p className="text-xs text-muted-foreground">
                Your username is your first and last name combined (no spaces)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your phone number"
                required
              />
              <p className="text-xs text-muted-foreground">
                Your password is your phone number on file
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Need help with login? Contact your manager</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;