import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Users, Building, UserCheck, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UserManagement } from '@/components/admin/UserManagement';
import { ManagerManagement } from '@/components/admin/ManagerManagement';
import { TeamManagement } from '@/components/admin/TeamManagement';
import { OnboardingManagement } from '@/components/admin/OnboardingManagement';

export const Admin: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">TriGuard Roofing - Complete Management System</p>
          </div>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-xl rounded-lg">
          <Tabs defaultValue="onboarding" className="w-full">
            <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
              <TabsTrigger value="onboarding" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Onboarding
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin Users
              </TabsTrigger>
              <TabsTrigger value="managers" className="flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Managers
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Teams
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Overview
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6">
              <TabsContent value="onboarding" className="mt-0">
                <OnboardingManagement />
              </TabsContent>
              
              <TabsContent value="users" className="mt-0">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="managers" className="mt-0">
                <ManagerManagement />
              </TabsContent>
              
              <TabsContent value="teams" className="mt-0">
                <TeamManagement />
              </TabsContent>
              
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">System Overview</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Get a comprehensive view of your organization's structure, 
                      onboarding progress, and administrative settings.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <FileText className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">Onboarding System</h4>
                      <p className="text-sm text-gray-600">Track employee progress through the 7-step onboarding process</p>
                    </div>
                    
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <UserCheck className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">Manager Network</h4>
                      <p className="text-sm text-gray-600">Manage team leaders and their contact information</p>
                    </div>
                    
                    <div className="text-center p-6 bg-purple-50 rounded-lg">
                      <Building className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-2">Team Structure</h4>
                      <p className="text-sm text-gray-600">Organize departments and team assignments</p>
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