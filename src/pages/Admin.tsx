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
              <div className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-card rounded-xl sm:rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab('onboarding')}>
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-primary shadow-md inline-block mb-4 sm:mb-6">
                  <FileText className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary-foreground" />
                </div>
                <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">Onboarding System</h4>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Track employee progress through the comprehensive 9-step onboarding process</p>
              </div>
              
              <div className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-card rounded-xl sm:rounded-2xl border border-success/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab('managers')}>
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-success shadow-md inline-block mb-4 sm:mb-6">
                  <UserCheck className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-success-foreground" />
                </div>
                <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">Manager Network</h4>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Manage team leaders, track their activity, and oversee organizational structure</p>
              </div>
              
              <div className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-card rounded-xl sm:rounded-2xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setActiveTab('recruiters')}>
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md inline-block mb-4 sm:mb-6">
                  <UserPlus className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
                </div>
                <h4 className="font-bold text-foreground mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">Recruiter Network</h4>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">Manage talent acquisition team and coordinate recruitment activities</p>
              </div>
              
              <div className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-card rounded-xl sm:rounded-2xl border border-warning/10 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1 cursor-pointer" onClick={() => setActiveTab('teams')}>
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
                  <Button variant="outline" size="sm" className="hover:bg-primary/10 text-xs sm:text-sm" onClick={() => setActiveTab('onboarding')}>
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    New Onboarding
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-success/10 text-xs sm:text-sm" onClick={() => setActiveTab('managers')}>
                    <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Add Manager
                  </Button>
                  <Button variant="outline" size="sm" className="hover:bg-warning/10 text-xs sm:text-sm" onClick={() => setActiveTab('teams')}>
                    <Building className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Create Team
                  </Button>
                </div>
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
      <div className="min-h-screen w-full flex bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Mobile-optimized Header */}
          <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <p className="text-muted-foreground text-xs sm:text-sm">TriGuard Roofing - Management System</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SidebarTrigger className="hidden lg:block" />
                <Button 
                  variant="outline" 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 min-h-[40px] px-3 sm:px-4"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-3 sm:p-6 lg:p-8">
            <div className="bg-gradient-card backdrop-blur-sm rounded-lg sm:rounded-2xl shadow-xl border border-primary/10 p-4 sm:p-6 lg:p-8">
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admin;