import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';

const ManagerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBackToHome = () => {
    console.log('Back to Home button clicked from Manager Login');
    navigate('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use secure authentication function
      const { data: managers, error } = await supabase
        .rpc('authenticate_manager', {
          manager_email: email,
          manager_password: password
        });

      if (error || !managers || managers.length === 0) {
        setError('Invalid email or password');
        return;
      }

      const manager = managers[0];

      // Check if password change is required
      if (manager.force_password_change) {
        // Store temporary session for password change
        localStorage.setItem('tempManagerAuth', 'true');
        localStorage.setItem('managerId', manager.id);
        localStorage.setItem('managerName', `${manager.first_name} ${manager.last_name}`);
        localStorage.setItem('managerEmail', manager.email);
        
        toast({
          title: "Password Change Required",
          description: "You must change your password before continuing",
        });
        
        navigate('/manager-password-change');
        return;
      }

      // Update last login time
      const { error: updateError } = await supabase
        .from('managers')
        .update({ 
          last_login_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString()
        })
        .eq('id', manager.id);

      if (updateError) {
        console.error('Failed to update login time:', updateError);
      }

      // Store manager session in localStorage
      localStorage.setItem('managerAuthenticated', 'true');
      localStorage.setItem('managerId', manager.id);
      localStorage.setItem('managerName', `${manager.first_name} ${manager.last_name}`);
      localStorage.setItem('managerEmail', manager.email);
      
      toast({
        title: "Login Successful",
        description: `Welcome ${manager.first_name}! Redirecting to your dashboard...`,
      });
      
      navigate('/manager-dashboard');
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
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
            <CardTitle className="text-2xl font-bold">Manager Portal</CardTitle>
            <CardDescription>
              Access your team management dashboard
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
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Access Dashboard"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Contact your administrator to get your login credentials</p>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default ManagerLogin;