import React from 'react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Settings, 
  UserCheck, 
  UserPlus, 
  Building, 
  ListTodo, 
  Users, 
  ChevronLeft, 
  LogOut,
  Menu
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    id: 'onboarding',
    title: 'Onboarding',
    icon: FileText,
    description: 'Track and manage employee onboarding processes'
  },
  {
    id: 'users',
    title: 'Admin Users',
    icon: Settings,
    description: 'Manage administrative users and permissions'
  },
  {
    id: 'managers',
    title: 'Managers',
    icon: UserCheck,
    description: 'Oversee team leaders and organizational structure'
  },
  {
    id: 'recruiters',
    title: 'Recruiters',
    icon: UserPlus,
    description: 'Manage talent acquisition team members'
  },
  {
    id: 'teams',
    title: 'Teams',
    icon: Building,
    description: 'Structure departments and team assignments'
  },
  {
    id: 'tasks',
    title: 'Tasks',
    icon: ListTodo,
    description: 'Assign and track team tasks and objectives'
  },
  {
    id: 'api',
    title: 'API',
    icon: Settings,
    description: 'Configure external system connections'
  },
  {
    id: 'overview',
    title: 'Overview',
    icon: Users,
    description: 'System overview and quick actions'
  },
];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCollapsed = state === 'collapsed';

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
    <Sidebar className="border-r border-border/50">
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-primary-foreground">TR</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-sm font-bold text-foreground">TriGuard Roofing</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    tooltip={isCollapsed ? item.title : undefined}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Action Buttons */}
      <SidebarFooter className="p-2 border-t border-border/50">
        <div className="space-y-2">
          <Link to="/" className="w-full">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full justify-start text-xs"
            >
              <ChevronLeft className="h-3 w-3 flex-shrink-0" />
              {!isCollapsed && <span className="ml-2">Back to Home</span>}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-xs hover:text-destructive"
          >
            <LogOut className="h-3 w-3 flex-shrink-0" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}