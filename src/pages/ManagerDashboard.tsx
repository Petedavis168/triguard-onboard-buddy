import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Users, CheckCircle, Clock, Plus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ManagerTaskCreation from '@/components/manager/ManagerTaskCreation';
import TeamMemberList from '@/components/manager/TeamMemberList';
import { useManagerActivity } from '@/hooks/useManagerActivity';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateActivity } = useManagerActivity();
  const [manager, setManager] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if manager is authenticated
    const isAuthenticated = localStorage.getItem('managerAuthenticated');
    const managerId = localStorage.getItem('managerId');
    
    if (!isAuthenticated || !managerId) {
      navigate('/manager-login');
      return;
    }

    fetchManagerData(managerId);
    
    // Update activity on page load
    updateActivity();
    
    // Set up interval to update activity every 5 minutes while active
    const interval = setInterval(updateActivity, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [navigate, updateActivity]);

  const fetchManagerData = async (managerId: string) => {
    try {
      // Fetch manager details
      const { data: managerData, error: managerError } = await supabase
        .from('managers')
        .select(`
          id,
          first_name,
          last_name,
          email,
          team_id,
          teams (
            id,
            name,
            description
          )
        `)
        .eq('id', managerId)
        .single();

      if (managerError) throw managerError;
      setManager(managerData);

      // Fetch team members (onboarding forms assigned to this manager)
      const { data: teamMembersData, error: teamError } = await supabase
        .from('onboarding_forms')
        .select(`
          id,
          first_name,
          last_name,
          generated_email,
          status,
          current_step,
          voice_recording_url,
          created_at,
          submitted_at
        `)
        .eq('manager_id', managerId)
        .order('created_at', { ascending: false });

      if (teamError) throw teamError;
      setTeamMembers(teamMembersData || []);

      // Fetch manager's tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          is_active,
          created_at,
          task_assignments (
            id,
            acknowledged_at,
            onboarding_forms (
              first_name,
              last_name
            )
          )
        `)
        .eq('manager_id', managerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

    } catch (error) {
      console.error('Error fetching manager data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('managerAuthenticated');
    localStorage.removeItem('managerId');
    localStorage.removeItem('managerName');
    localStorage.removeItem('managerEmail');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/manager-login');
  };

  const refreshData = () => {
    updateActivity(); // Track activity when refreshing data
    const managerId = localStorage.getItem('managerId');
    if (managerId) {
      fetchManagerData(managerId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Mobile-optimized Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome, {manager?.first_name}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {manager?.teams?.name || 'No Team Assigned'} - Manager Dashboard
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="flex items-center gap-2 min-h-[44px] px-4"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        {/* Mobile-optimized Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Team</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">Members</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Done</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {teamMembers.filter(m => m.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground">Finished</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Active</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {teamMembers.filter(m => m.status === 'in_progress').length}
              </div>
              <p className="text-xs text-muted-foreground">Working</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Tasks</CardTitle>
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground">Created</p>
            </CardContent>
          </Card>
        </div>

        {/* Mobile-optimized Main Content */}
        <div className="bg-white shadow-xl rounded-lg">
          <Tabs defaultValue="team" className="w-full" onValueChange={() => updateActivity()}>
            {/* Mobile-friendly tabs */}
            <div className="px-4 sm:px-6 pt-4">
              <TabsList className="grid w-full grid-cols-3 rounded-lg">
                <TabsTrigger value="team" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Team</span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Tasks</span>
                </TabsTrigger>
                <TabsTrigger value="create" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Create</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-4 sm:p-6">
              <TabsContent value="team" className="mt-0">
                <TeamMemberList 
                  teamMembers={teamMembers} 
                  onRefresh={refreshData}
                />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-0">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Your Tasks</h3>
                    {tasks.length === 0 ? (
                      <div className="text-center py-8 sm:py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No tasks created yet</p>
                        <p className="text-sm text-gray-400">Switch to "Create" tab to add your first task</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {tasks.map((task) => (
                          <Card key={task.id} className="border-l-4 border-l-blue-500 shadow-md">
                            <CardHeader className="pb-3">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base sm:text-lg truncate">{task.title}</CardTitle>
                                  {task.description && (
                                    <CardDescription className="mt-2 text-sm">
                                      {task.description}
                                    </CardDescription>
                                  )}
                                </div>
                                <Badge variant="secondary" className="text-xs w-fit">
                                  {task.task_assignments?.length || 0} assignments
                                </Badge>
                              </div>
                            </CardHeader>
                            {task.task_assignments?.length > 0 && (
                              <CardContent className="pt-0">
                                <div className="text-sm text-muted-foreground">
                                  <p className="mb-2">Created: {new Date(task.created_at).toLocaleDateString()}</p>
                                  <div>
                                    <p className="font-medium mb-1">Acknowledged by:</p>
                                    <ul className="list-disc list-inside ml-2 space-y-1">
                                      {task.task_assignments
                                        .filter(a => a.acknowledged_at)
                                        .map((assignment, index) => (
                                          <li key={index} className="text-xs sm:text-sm">
                                            {assignment.onboarding_forms?.first_name} {assignment.onboarding_forms?.last_name}
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="create" className="mt-0">
                <ManagerTaskCreation 
                  managerId={manager?.id}
                  teamId={manager?.team_id}
                  onTaskCreated={refreshData}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;