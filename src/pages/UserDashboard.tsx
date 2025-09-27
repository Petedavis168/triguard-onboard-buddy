import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('userAuthenticated');
    const userId = localStorage.getItem('userId');
    
    if (!isAuthenticated || !userId) {
      navigate('/user-login');
      return;
    }

    fetchUserData(userId);
  }, [navigate]);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user details
      const { data: userData, error: userError } = await supabase
        .from('onboarding_forms')
        .select(`
          *,
          managers (
            first_name,
            last_name,
            email
          ),
          teams (
            name,
            description
          )
        `)
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        console.error('Database error:', userError);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return;
      }
      
      if (!userData) {
        toast({
          title: "Error",
          description: "User profile not found",
          variant: "destructive",
        });
        navigate('/user-login');
        return;
      }
      
      setUser(userData);

      // Fetch user's tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('task_assignments')
        .select(`
          *,
          tasks (
            title,
            description,
            created_at
          )
        `)
        .eq('onboarding_form_id', userId)
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('Tasks error:', tasksError);
        // Don't block the dashboard if tasks fail to load
      } else {
        setTasks(tasksData || []);
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userAuthenticated');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/user-login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return <Badge className="bg-green-600">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.first_name} {user?.last_name}
            </h1>
            <p className="text-gray-600 mt-1">
              Employee Profile & Information
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  <strong>Email:</strong> {user?.generated_email || user?.personal_email || 'Not set'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  <strong>Phone:</strong> {user?.cell_phone || 'Not set'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  <strong>Address:</strong> {user?.street_address}, {user?.city}, {user?.state} {user?.zip_code}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  <strong>Started:</strong> {formatDate(user?.created_at)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Onboarding Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Current Status:</span>
                {getStatusBadge(user?.status)}
              </div>
              <div className="flex items-center justify-between">
                <span>Progress:</span>
                <span className="text-sm font-medium">Step {user?.current_step || 1} of 11</span>
              </div>
              {user?.managers && (
                <div>
                  <span className="text-sm font-medium">Manager:</span>
                  <p className="text-sm text-gray-600">
                    {user.managers.first_name} {user.managers.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user.managers.email}</p>
                </div>
              )}
              {user?.teams && (
                <div>
                  <span className="text-sm font-medium">Team:</span>
                  <p className="text-sm text-gray-600">{user.teams.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Tasks
            </CardTitle>
            <CardDescription>
              Tasks assigned to you by your manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tasks assigned yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((taskAssignment) => (
                  <div key={taskAssignment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{taskAssignment.tasks?.title}</h3>
                      <Badge variant={taskAssignment.acknowledged_at ? "default" : "secondary"}>
                        {taskAssignment.acknowledged_at ? "Acknowledged" : "Pending"}
                      </Badge>
                    </div>
                    {taskAssignment.tasks?.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {taskAssignment.tasks.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-500">
                      <p>Assigned: {formatDate(taskAssignment.created_at)}</p>
                      {taskAssignment.acknowledged_at && (
                        <p>Acknowledged: {formatDate(taskAssignment.acknowledged_at)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;