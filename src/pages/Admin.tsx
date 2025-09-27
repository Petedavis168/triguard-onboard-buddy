import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserManagement } from '@/components/admin/UserManagement';
import { TeamManagement } from '@/components/admin/TeamManagement';
import TaskManagement from '@/components/admin/TaskManagement';
import OnboardingManagement from '@/components/admin/OnboardingManagement';
import { ManagerManagement } from '@/components/admin/ManagerManagement';
import { RecruiterManagement } from '@/components/admin/RecruiterManagement';
import ApiIntegration from '@/components/admin/ApiIntegration';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import LMSManagement from "@/components/admin/LMSManagement";
import { DepartmentManagement } from "@/components/admin/DepartmentManagement";
import { PositionManagement } from "@/components/admin/PositionManagement";
import { 
  FileText, 
  Settings, 
  UserCheck, 
  UserPlus, 
  Building, 
  ListTodo, 
  Users,
  BookOpen,
  Building2,
  UserCog
} from 'lucide-react';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('onboarding');

  useEffect(() => {
    // Check if admin is authenticated
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate('/admin-login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'onboarding':
        return (
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
        );
      
      case 'users':
        return (
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
        );
      
      case 'managers':
        return (
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
        );
      
      case 'recruiters':
        return (
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
        );

      case 'api':
        return (
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
        );
      
      case 'teams':
        return (
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
        );
      
      case 'tasks':
        return (
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
        );
        case 'lms':
          return (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Learning Management</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Manage courses, quizzes, and training programs</p>
                </div>
              </div>
              <LMSManagement />
            </div>
          );
        case 'departments':
          return (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Department Management</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Organize departments and team structures</p>
                </div>
              </div>
              <DepartmentManagement />
            </div>
          );
        case 'positions':
          return (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-md">
                  <UserCog className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Position Management</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Define roles and position hierarchies</p>
                </div>
              </div>
              <PositionManagement />
            </div>
          );
        return (
          <div className="space-y-8 lg:space-y-12">
            {/* Hero Section */}
            <div className="text-center py-8 lg:py-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-3xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_70%)]"></div>
              <div className="relative z-10 px-4">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-primary shadow-xl mb-6 ring-4 ring-primary/10">
                  <Users className="h-12 w-12 lg:h-16 lg:w-16 text-primary-foreground" />
                </div>
                <h3 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                  Command Center
                </h3>
                <p className="text-muted-foreground max-w-3xl mx-auto text-lg lg:text-xl leading-relaxed">
                  Your comprehensive dashboard for managing TriGuard Roofing's operations, 
                  from employee onboarding to team coordination and system administration.
                </p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-xs text-muted-foreground">Active Forms</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-2xl p-6 border border-success/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">8</p>
                    <p className="text-xs text-muted-foreground">Managers</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl p-6 border border-warning/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center">
                    <Building className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-warning">5</p>
                    <p className="text-xs text-muted-foreground">Teams</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent-foreground">24</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <div 
                className="group bg-gradient-to-br from-card via-card/95 to-card/90 rounded-2xl p-8 border border-primary/10 hover:border-primary/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer backdrop-blur-sm" 
                onClick={() => setActiveTab('onboarding')}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">Onboarding Hub</h4>
                    <p className="text-muted-foreground text-sm">Employee Integration</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Streamline the complete employee onboarding experience with our 9-step process, 
                  from initial documentation to team integration and role assignment.
                </p>
                <div className="flex items-center text-primary text-sm font-medium group-hover:gap-3 gap-2 transition-all">
                  <span>Manage Process</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
              
              <div 
                className="group bg-gradient-to-br from-card via-card/95 to-card/90 rounded-2xl p-8 border border-success/10 hover:border-success/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer backdrop-blur-sm" 
                onClick={() => setActiveTab('lms')}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors">Learning Center</h4>
                    <p className="text-muted-foreground text-sm">Training & Development</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Create comprehensive training programs with video content, interactive quizzes, 
                  and role-based learning paths to ensure team excellence.
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-3 gap-2 transition-all">
                  <span>Manage Courses</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
              
              <div 
                className="group bg-gradient-to-br from-card via-card/95 to-card/90 rounded-2xl p-8 border border-warning/10 hover:border-warning/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer backdrop-blur-sm md:col-span-2 lg:col-span-1" 
                onClick={() => setActiveTab('managers')}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-success rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <UserCheck className="h-7 w-7 text-success-foreground" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground group-hover:text-success transition-colors">Team Leadership</h4>
                    <p className="text-muted-foreground text-sm">Manager Coordination</p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Coordinate with team managers, track leadership activities, and maintain 
                  organizational structure across all departments and regions.
                </p>
                <div className="flex items-center text-success text-sm font-medium group-hover:gap-3 gap-2 transition-all">
                  <span>View Managers</span>
                  <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 rounded-2xl p-8 border border-border/20">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-foreground mb-2">Quick Actions</h4>
                <p className="text-muted-foreground">Jump to common administrative tasks</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  variant="outline" 
                  className="bg-background/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200" 
                  onClick={() => setActiveTab('onboarding')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Review Applications
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-background/50 hover:bg-success/10 hover:border-success/30 hover:text-success transition-all duration-200" 
                  onClick={() => setActiveTab('managers')}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Add Manager
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-background/50 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-600 transition-all duration-200" 
                  onClick={() => setActiveTab('lms')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-background/50 hover:bg-warning/10 hover:border-warning/30 hover:text-warning transition-all duration-200" 
                  onClick={() => setActiveTab('teams')}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Manage Teams
                </Button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-gradient-to-br from-background via-background/95 to-muted/20">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Enhanced Header */}
          <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/20 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="lg:hidden p-2 hover:bg-muted/50 rounded-lg transition-colors" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-primary-foreground">TR</span>
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                        Admin Dashboard
                      </h1>
                      <p className="text-muted-foreground text-sm">TriGuard Roofing Management System</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="hidden lg:flex p-2 hover:bg-muted/50 rounded-lg transition-colors" />
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">System Online</span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 px-4 py-2 hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Enhanced Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-7xl">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-border/50 overflow-hidden">
                <div className="p-6 sm:p-8 lg:p-10">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;