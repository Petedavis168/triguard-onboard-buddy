import React from 'react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, Calendar, ClipboardList, UserCheck, Settings, BookOpen, FileText, Building2, UserCog, UserPlus, Building, ListTodo, ChevronLeft, User } from "lucide-react";
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
    id: 'overview',
    title: 'Overview',
    icon: Users,
    description: 'System overview and quick actions'
  },
  {
    id: 'onboarding',
    title: 'Onboarding',
    icon: FileText,
    description: 'Track and manage employee onboarding processes'
  },
  {
    id: 'employees',
    title: 'Employee Profiles',
    icon: User,
    description: 'Manage employee information and photos'
  },
  {
    id: 'lms',
    title: 'Learning Management',
    icon: BookOpen,
    description: 'Manage courses, quizzes, and training programs'
  },
  {
    id: 'departments',
    title: 'Departments',
    icon: Building2,
    description: 'Organize departments and team structures'
  },
  {
    id: 'positions',
    title: 'Positions',
    icon: UserCog,
    description: 'Define roles and position hierarchies'
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
];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="border-r border-border/30 bg-card/30 backdrop-blur-sm">
      {/* Enhanced Header */}
      <SidebarHeader className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg ring-2 ring-primary/20">
            <span className="text-sm font-bold text-primary-foreground">TR</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-foreground truncate">TriGuard Roofing</h2>
              <p className="text-xs text-muted-foreground">Admin Control Panel</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Enhanced Navigation Content */}
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-3 ${isCollapsed ? "sr-only" : ""}`}>
            Management Hub
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    tooltip={isCollapsed ? item.title : undefined}
                    className={`
                      w-full justify-start px-3 py-3 rounded-xl transition-all duration-200 group
                      ${activeTab === item.id 
                        ? 'bg-primary/10 text-primary shadow-sm border border-primary/20 hover:bg-primary/15' 
                        : 'hover:bg-muted/50 hover:text-foreground hover:shadow-sm'
                      }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      activeTab === item.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    }`} />
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0 ml-3">
                        <div className={`text-sm font-medium truncate ${
                          activeTab === item.id ? 'text-primary' : 'text-foreground'
                        }`}>
                          {item.title}
                        </div>
                      </div>
                    )}
                    {!isCollapsed && activeTab === item.id && (
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Enhanced Footer */}
      <SidebarFooter className="p-4 border-t border-border/30 bg-gradient-to-r from-muted/20 to-muted/10">
        <div className="space-y-2">
          <Link to="/" className="w-full">
            <Button 
              variant="ghost" 
              size="sm"
              className={`w-full justify-start text-sm font-medium hover:bg-muted/50 transition-all duration-200 ${
                isCollapsed ? 'justify-center px-2' : 'px-3'
              }`}
            >
              <ChevronLeft className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              {!isCollapsed && <span className="ml-2 text-muted-foreground">Back to Home</span>}
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}