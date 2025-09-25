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

const ManagerLogin = () => {
  const [selectedManager, setSelectedManager] = useState('');
  const [managers, setManagers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingManagers, setIsLoadingManagers] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    setIsLoadingManagers(true);
    try {
      const { data, error } = await supabase
        .from('managers')
        .select(`
          id,
          first_name,
          last_name,
          email,
          teams (
            name
          )
        `)
        .order('first_name');

      if (error) throw error;
      setManagers(data || []);
    } catch (error) {
      console.error('Error fetching managers:', error);
      toast({
        title: "Error",
        description: "Failed to load managers",
        variant: "destructive",
      });
    } finally {
      setIsLoadingManagers(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManager) {
      setError('Please select a manager');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const manager = managers.find(m => m.id === selectedManager);
      if (manager) {
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
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
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
              <Label htmlFor="manager">Select Manager</Label>
              {isLoadingManagers ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <Select
                  value={selectedManager}
                  onValueChange={setSelectedManager}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your manager profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.first_name} {manager.last_name} - {manager.teams?.name || 'No Team'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isLoadingManagers}
            >
              {isLoading ? "Signing in..." : "Access Dashboard"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>Need help? Contact IT support</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerLogin;