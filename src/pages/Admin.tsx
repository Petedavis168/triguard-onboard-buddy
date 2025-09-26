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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 p-4 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 animate-slide-up">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse-glow">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">TriGuard Roofing - Complete Management System</p>
          </div>
          <div className="flex gap-3">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2 hover-lift border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="flex items-center gap-2 hover-lift border-destructive/20 hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="bg-gradient-card backdrop-blur-sm rounded-2xl shadow-2xl border border-primary/10 overflow-hidden animate-scale-in">
          <Tabs defaultValue="onboarding" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-muted/30 backdrop-blur-sm border-b border-primary/10 p-2 gap-1 rounded-none">
              <TabsTrigger 
                value="onboarding" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all duration-300 hover-lift rounded-lg"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Onboarding</span>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all duration-300 hover-lift rounded-lg"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Users</span>
              </TabsTrigger>
              <TabsTrigger 
                value="managers" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all duration-300 hover-lift rounded-lg"
              >
                <UserCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Managers</span>
              </TabsTrigger>
              <TabsTrigger 
                value="recruiters" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all duration-300 hover-lift rounded-lg"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Recruiters</span>
              </TabsTrigger>
              <TabsTrigger 
                value="api" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all duration-300 hover-lift rounded-lg"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">API</span>
              </TabsTrigger>
              <TabsTrigger 
                value="teams" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all duration-300 hover-lift rounded-lg"
              >
                <Building className="h-4 w-4" />
                <span className="hidden sm:inline">Teams</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tasks" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all duration-300 hover-lift rounded-lg"
              >
                <ListTodo className="h-4 w-4" />
                <span className="hidden sm:inline">Tasks</span>
              </TabsTrigger>
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow transition-all duration-300 hover-lift rounded-lg"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="p-8 bg-gradient-to-br from-background via-secondary/5 to-muted/10">
              <TabsContent value="onboarding" className="mt-0 animate-fade-in">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-primary shadow-glow">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Onboarding Management</h2>
                      <p className="text-muted-foreground">Track and manage employee onboarding processes</p>
                    </div>
                  </div>
                  <OnboardingManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="users" className="mt-0 animate-fade-in">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Admin User Management</h2>
                      <p className="text-muted-foreground">Manage administrative users and permissions</p>
                    </div>
                  </div>
                  <UserManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="managers" className="mt-0 animate-fade-in">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-success shadow-lg shadow-green-500/25">
                      <UserCheck className="h-6 w-6 text-success-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Manager Directory</h2>
                      <p className="text-muted-foreground">Oversee team leaders and organizational structure</p>
                    </div>
                  </div>
                  <ManagerManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="recruiters" className="mt-0 animate-fade-in">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Recruiter Network</h2>
                      <p className="text-muted-foreground">Manage talent acquisition team members</p>
                    </div>
                  </div>
                  <RecruiterManagement />
                </div>
              </TabsContent>

              <TabsContent value="api" className="mt-0 animate-fade-in">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25">
                      <Settings className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">API Integration</h2>
                      <p className="text-muted-foreground">Configure external system connections</p>
                    </div>
                  </div>
                  <ApiIntegration />
                </div>
              </TabsContent>
              
              <TabsContent value="teams" className="mt-0 animate-fade-in">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-warning shadow-lg shadow-orange-500/25">
                      <Building className="h-6 w-6 text-warning-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Team Organization</h2>
                      <p className="text-muted-foreground">Structure departments and team assignments</p>
                    </div>
                  </div>
                  <TeamManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="tasks" className="mt-0 animate-fade-in">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-500/25">
                      <ListTodo className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Task Management</h2>
                      <p className="text-muted-foreground">Assign and track team tasks and objectives</p>
                    </div>
                  </div>
                  <TaskManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="overview" className="mt-0 animate-fade-in">
                <div className="space-y-8">
                  <div className="text-center py-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 rounded-3xl"></div>
                    <div className="relative z-10">
                      <div className="p-4 rounded-2xl bg-gradient-primary shadow-glow inline-block mb-6 animate-float">
                        <Users className="h-12 w-12 text-primary-foreground" />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        System Overview
                      </h3>
                      <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                        Get a comprehensive view of your organization's structure, 
                        onboarding progress, and administrative settings all in one place.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="group text-center p-8 bg-gradient-card rounded-2xl border border-primary/10 hover-lift hover:border-primary/30 transition-all duration-300 hover:shadow-glow">
                      <div className="p-4 rounded-2xl bg-gradient-primary shadow-lg inline-block mb-6 group-hover:animate-pulse-glow">
                        <FileText className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <h4 className="font-bold text-foreground mb-3 text-lg">Onboarding System</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Track employee progress through the comprehensive 9-step onboarding process</p>
                    </div>
                    
                    <div className="group text-center p-8 bg-gradient-card rounded-2xl border border-success/10 hover-lift hover:border-success/30 transition-all duration-300 hover:shadow-lg hover:shadow-success/20">
                      <div className="p-4 rounded-2xl bg-gradient-success shadow-lg inline-block mb-6 group-hover:animate-pulse-glow">
                        <UserCheck className="h-8 w-8 text-success-foreground" />
                      </div>
                      <h4 className="font-bold text-foreground mb-3 text-lg">Manager Network</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Manage team leaders, track their activity, and oversee organizational structure</p>
                    </div>
                    
                    <div className="group text-center p-8 bg-gradient-card rounded-2xl border border-emerald-200/50 hover-lift hover:border-emerald-300/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg inline-block mb-6 group-hover:animate-pulse-glow">
                        <UserPlus className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-bold text-foreground mb-3 text-lg">Recruiter Network</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Manage talent acquisition team and coordinate recruitment activities</p>
                    </div>
                    
                    <div className="group text-center p-8 bg-gradient-card rounded-2xl border border-warning/10 hover-lift hover:border-warning/30 transition-all duration-300 hover:shadow-lg hover:shadow-warning/20">
                      <div className="p-4 rounded-2xl bg-gradient-warning shadow-lg inline-block mb-6 group-hover:animate-pulse-glow">
                        <Building className="h-8 w-8 text-warning-foreground" />
                      </div>
                      <h4 className="font-bold text-foreground mb-3 text-lg">Team Structure</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">Organize departments, manage team assignments and track performance</p>
                    </div>
                  </div>

                  <div className="mt-12 p-8 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl border border-primary/10">
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-foreground mb-4">Quick Actions</h4>
                      <div className="flex flex-wrap justify-center gap-4">
                        <Button variant="outline" className="hover-lift hover:bg-primary/10">
                          <FileText className="h-4 w-4 mr-2" />
                          New Onboarding
                        </Button>
                        <Button variant="outline" className="hover-lift hover:bg-success/10">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Add Manager
                        </Button>
                        <Button variant="outline" className="hover-lift hover:bg-warning/10">
                          <Building className="h-4 w-4 mr-2" />
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