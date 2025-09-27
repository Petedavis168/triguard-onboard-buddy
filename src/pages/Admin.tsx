import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Users, Building, UserCheck, FileText, Settings, LogOut, ListTodo, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserManagement } from '@/components/admin/UserManagement';
import { TeamManagement } from '@/components/admin/TeamManagement';
import TaskManagement from '@/components/admin/TaskManagement';
import OnboardingManagement from '@/components/admin/OnboardingManagement';
import { ManagerManagement } from '@/components/admin/ManagerManagement';
import { RecruiterManagement } from '@/components/admin/RecruiterManagement';
import ApiIntegration from '@/components/admin/ApiIntegration';
import { useToast } from '@/hooks/use-toast';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header - Mobile Optimized */}
        <header className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">TriGuard Roofing - Complete Management System</p>
            </div>
            <div className="flex gap-2 sm:gap-3 self-start sm:self-auto">
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Back to Home</span>
                  <span className="xs:hidden">Back</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout} 
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:text-destructive"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Logout</span>
                <span className="xs:hidden">Exit</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content - Mobile Optimized */}
        <div className="bg-gradient-card backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-xl border border-primary/10 overflow-hidden">
          <Tabs defaultValue="onboarding" className="w-full">
            {/* Mobile-First Tab Navigation */}
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-full min-w-max bg-muted/30 backdrop-blur-sm border-b border-primary/10 p-1 sm:p-2 gap-0.5 sm:gap-1 rounded-none">
                <TabsTrigger 
                  value="onboarding" 
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Onboarding</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="users" 
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Admin Users</span>
                  <span className="sm:hidden">Users</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="managers" 
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Managers</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="recruiters" 
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Recruiters</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="api" 
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>API</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="teams" 
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Teams</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks" 
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <ListTodo className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Tasks</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground transition-all duration-200 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Overview</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-3 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-secondary/5 to-muted/10">
              <TabsContent value="onboarding" className="mt-0">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-primary shadow-md">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Onboarding Management</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">Track and manage employee onboarding processes</p>
                    </div>
                  </div>
                  <OnboardingManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="users" className="mt-0">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Admin User Management</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">Manage administrative users and permissions</p>
                    </div>
                  </div>
                  <UserManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="managers" className="mt-0">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-success shadow-md">
                      <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-success-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Manager Directory</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">Oversee team leaders and organizational structure</p>
                    </div>
                  </div>
                  <ManagerManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="recruiters" className="mt-0">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md">
                      <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Recruiter Network</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">Manage talent acquisition team members</p>
                    </div>
                  </div>
                  <RecruiterManagement />
                </div>
              </TabsContent>

              <TabsContent value="api" className="mt-0">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-md">
                      <Settings className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">API Integration</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">Configure external system connections</p>
                    </div>
                  </div>
                  <ApiIntegration />
                </div>
              </TabsContent>
              
              <TabsContent value="teams" className="mt-0">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-warning shadow-md">
                      <Building className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-warning-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Team Organization</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">Structure departments and team assignments</p>
                    </div>
                  </div>
                  <TeamManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-0">
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-md">
                      <ListTodo className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Task Management</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">Assign and track team tasks and objectives</p>
                    </div>
                  </div>
                  <TaskManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6 sm:space-y-8">
                  <div className="text-center py-8 sm:py-12 lg:py-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 rounded-2xl sm:rounded-3xl"></div>
                    <div className="relative z-10 px-4">
                      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-primary shadow-md inline-block mb-4 sm:mb-6">
                        <Users className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 sm:mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        System Overview
                      </h3>
                      <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
                        Get a comprehensive view of your organization's structure, 
                        onboarding progress, and administrative settings all in one place.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-card rounded-xl sm:rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-primary shadow-md inline-block mb-4 sm:mb-6">
                        <FileText className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary-foreground" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">Onboarding System</h4>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Track employee progress through the comprehensive 9-step onboarding process</p>
                    </div>
                    
                    <div className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-card rounded-xl sm:rounded-2xl border border-success/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-success shadow-md inline-block mb-4 sm:mb-6">
                        <UserCheck className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-success-foreground" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">Manager Network</h4>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Manage team leaders, track their activity, and oversee organizational structure</p>
                    </div>
                    
                    <div className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-card rounded-xl sm:rounded-2xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md inline-block mb-4 sm:mb-6">
                        <UserPlus className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">Recruiter Network</h4>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Manage talent acquisition team and coordinate recruitment activities</p>
                    </div>
                    
                    <div className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-card rounded-xl sm:rounded-2xl border border-warning/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-warning shadow-md inline-block mb-4 sm:mb-6">
                        <Building className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-warning-foreground" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">Team Structure</h4>
                      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Organize departments, manage team assignments and track performance</p>
                    </div>
                  </div>

                  <div className="mt-8 sm:mt-12 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-xl sm:rounded-2xl border border-primary/10">
                    <div className="text-center">
                      <h4 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-3 sm:mb-4">Quick Actions</h4>
                      <div className="flex flex-col xs:flex-row flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
                        <Button variant="outline" size="sm" className="hover:bg-primary/10 text-xs sm:text-sm">
                          <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          New Onboarding
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-success/10 text-xs sm:text-sm">
                          <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Add Manager
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-warning/10 text-xs sm:text-sm">
                          <Building className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Create Team
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;