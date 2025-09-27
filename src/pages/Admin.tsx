import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminStats } from '@/hooks/useAdminStats';
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
import EmployeeProfileManagement from "@/components/admin/EmployeeProfileManagement";
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
  UserCog,
  User
} from 'lucide-react';

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const { stats, recentActivity, isLoading: statsLoading } = useAdminStats();

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
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-primary shadow-md">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">System Overview</h2>
                <p className="text-sm text-muted-foreground">Real-time dashboard and analytics</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  {stats.onboardingForms.pending > 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {stats.onboardingForms.pending} pending
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {statsLoading ? '—' : stats.onboardingForms.total}
                </h3>
                <p className="text-sm text-muted-foreground">Onboarding Forms</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.onboardingForms.completed} completed
                </p>
              </div>

              <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-xl p-6 border border-success/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <UserCheck className="h-5 w-5 text-success" />
                  </div>
                  {stats.managers.active > 0 && (
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                      {stats.managers.active} active
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {statsLoading ? '—' : stats.managers.total}
                </h3>
                <p className="text-sm text-muted-foreground">Managers</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.teams.total} teams managed
                </p>
              </div>

              <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl p-6 border border-warning/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-warning/20 rounded-lg">
                    <Building2 className="h-5 w-5 text-warning" />
                  </div>
                  {stats.teams.departments > 0 && (
                    <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full">
                      {stats.teams.departments} depts
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {statsLoading ? '—' : stats.teams.total}
                </h3>
                <p className="text-sm text-muted-foreground">Teams</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.teams.departments} departments
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  </div>
                  {stats.learning.quizzes > 0 && (
                    <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full">
                      {stats.learning.quizzes} quizzes
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {statsLoading ? '—' : stats.learning.courses}
                </h3>
                <p className="text-sm text-muted-foreground">Learning Courses</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.learning.enrollments} enrollments
                </p>
              </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {statsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-pulse">
                          <div className="w-2 h-2 bg-muted rounded-full"></div>
                          <div className="flex-1 space-y-1">
                            <div className="w-3/4 h-3 bg-muted rounded"></div>
                            <div className="w-1/2 h-2 bg-muted rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div 
                          className={`w-2 h-2 rounded-full ${
                            activity.color === 'primary' ? 'bg-primary' :
                            activity.color === 'success' ? 'bg-success' :
                            activity.color === 'warning' ? 'bg-warning' :
                            'bg-blue-500'
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">No recent activity to display</p>
                      <p className="text-xs text-muted-foreground mt-1">Activity will appear as users interact with the system</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveTab('onboarding')}
                    className="p-4 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-lg text-left transition-colors group"
                  >
                    <FileText className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground">Review Forms</p>
                    <p className="text-xs text-muted-foreground">
                      {stats.onboardingForms.pending} pending
                    </p>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('lms')}
                    className="p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg text-left transition-colors group"
                  >
                    <BookOpen className="h-5 w-5 text-blue-500 mb-2" />
                    <p className="text-sm font-medium text-foreground">Add Course</p>
                    <p className="text-xs text-muted-foreground">Create training</p>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('managers')}
                    className="p-4 bg-success/10 hover:bg-success/20 border border-success/20 rounded-lg text-left transition-colors group"
                  >
                    <UserCheck className="h-5 w-5 text-success mb-2" />
                    <p className="text-sm font-medium text-foreground">Assign Teams</p>
                    <p className="text-xs text-muted-foreground">Manage structure</p>
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('tasks')}
                    className="p-4 bg-warning/10 hover:bg-warning/20 border border-warning/20 rounded-lg text-left transition-colors group"
                  >
                    <ListTodo className="h-5 w-5 text-warning mb-2" />
                    <p className="text-sm font-medium text-foreground">Create Task</p>
                    <p className="text-xs text-muted-foreground">Assign work</p>
                  </button>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-success/20 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-success rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-foreground">Database</p>
                  <p className="text-xs text-success">Online</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-success/20 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-success rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-foreground">API Services</p>
                  <p className="text-xs text-success">Active</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-success/20 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-success rounded-full"></div>
                  </div>
                  <p className="text-sm font-medium text-foreground">File Storage</p>
                  <p className="text-xs text-success">Operational</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'employees':
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                <User className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Employee Profiles</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Manage employee information and photos</p>
              </div>
            </div>
            <EmployeeProfileManagement />
          </div>
        );
        
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
                  <SidebarTrigger className="p-2 hover:bg-muted/50 rounded-lg transition-colors" />
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
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">System Online</span>
                  </div>
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