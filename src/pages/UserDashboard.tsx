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
        {/* Mobile-optimized Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome, {user?.first_name}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Employee Profile & Information
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="flex items-center gap-2 min-h-[44px] px-4"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Mobile-optimized Profile Information */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600 break-all">
                      {user?.generated_email || user?.personal_email || 'Not set'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{user?.cell_phone || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:col-span-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">
                      {user?.street_address}, {user?.city}, {user?.state} {user?.zip_code}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Started</p>
                    <p className="text-sm text-gray-600">{formatDate(user?.created_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Onboarding Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status:</span>
                {getStatusBadge(user?.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress:</span>
                <span className="text-sm font-medium">Step {user?.current_step || 1} of 11</span>
              </div>
              
              {user?.managers && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-900 mb-1">Manager:</p>
                  <p className="text-sm text-gray-600">
                    {user.managers.first_name} {user.managers.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user.managers.email}</p>
                </div>
              )}
              
              {user?.teams && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-900 mb-1">Team:</p>
                  <p className="text-sm text-gray-600">{user.teams.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mobile-optimized Tasks */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5" />
              Your Tasks
            </CardTitle>
            <CardDescription className="text-sm">
              Tasks assigned to you by your manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No tasks assigned yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((taskAssignment) => (
                  <div key={taskAssignment.id} className="border rounded-lg p-4 bg-gray-50/50">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                      <h3 className="font-medium text-sm sm:text-base">{taskAssignment.tasks?.title}</h3>
                      <Badge 
                        variant={taskAssignment.acknowledged_at ? "default" : "secondary"}
                        className="w-fit text-xs"
                      >
                        {taskAssignment.acknowledged_at ? "Acknowledged" : "Pending"}
                      </Badge>
                    </div>
                    {taskAssignment.tasks?.description && (
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {taskAssignment.tasks.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-500 space-y-1 border-t border-gray-200 pt-2">
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