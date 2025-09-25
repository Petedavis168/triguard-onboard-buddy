import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, Users, CheckCircle, Clock, Plus, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ManagerTaskCreation from '@/components/manager/ManagerTaskCreation';
import TeamMemberList from '@/components/manager/TeamMemberList';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  }, [navigate]);

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {manager?.first_name} {manager?.last_name}
            </h1>
            <p className="text-gray-600 mt-1">
              {manager?.teams?.name || 'No Team Assigned'} - Manager Dashboard
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <p className="text-xs text-muted-foreground">
                Active onboarding
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(m => m.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Finished onboarding
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamMembers.filter(m => m.status === 'in_progress').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently onboarding
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground">
                Created by you
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-xl rounded-lg">
          <Tabs defaultValue="team" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b">
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Members
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Task Management
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Task
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6">
              <TabsContent value="team" className="mt-0">
                <TeamMemberList 
                  teamMembers={teamMembers} 
                  onRefresh={refreshData}
                />
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Your Tasks</h3>
                    {tasks.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No tasks created yet</p>
                        <p className="text-sm text-gray-400">Switch to "Create Task" tab to add your first task</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {tasks.map((task) => (
                          <Card key={task.id} className="border-l-4 border-l-blue-500">
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{task.title}</CardTitle>
                                  {task.description && (
                                    <CardDescription className="mt-2">
                                      {task.description}
                                    </CardDescription>
                                  )}
                                </div>
                                <Badge variant="secondary">
                                  {task.task_assignments?.length || 0} assignments
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-sm text-muted-foreground">
                                <p>Created: {new Date(task.created_at).toLocaleDateString()}</p>
                                {task.task_assignments?.length > 0 && (
                                  <div className="mt-2">
                                    <p className="font-medium">Acknowledged by:</p>
                                    <ul className="list-disc list-inside ml-2">
                                      {task.task_assignments
                                        .filter(a => a.acknowledged_at)
                                        .map((assignment, index) => (
                                          <li key={index}>
                                            {assignment.onboarding_forms?.first_name} {assignment.onboarding_forms?.last_name}
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </CardContent>
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