import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Settings, 
  UserCheck, 
  Building, 
  FileText,
  BarChart3 
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/70">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow animate-float">
              <span className="text-2xl font-bold text-white">TR</span>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                TriGuard Roofing
              </h1>
              <p className="text-xl text-muted-foreground">Employee Management System</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Streamline your hiring process with our comprehensive onboarding and management platform
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Employee Onboarding */}
          <Card className="shadow-2xl border-0 bg-gradient-card hover-lift animate-scale-in group cursor-pointer">
            <Link to="/onboarding">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">New Employee Onboarding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Complete your employee onboarding process with our step-by-step guided form
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Employee Login */}
          <Card className="shadow-2xl border-0 bg-gradient-card hover-lift animate-scale-in group cursor-pointer">
            <Link to="/user-login">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Employee Login</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Access your employee profile, view tasks, and track your progress
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Recruiting Dashboard */}
          <Card className="shadow-2xl border-0 bg-gradient-card hover-lift animate-scale-in group cursor-pointer">
            <Link to="/recruiting">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Recruiting Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  View and manage onboarding submissions with our CRM-style recruiting tools
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Manager Portal */}
          <Card className="shadow-2xl border-0 bg-gradient-card hover-lift animate-scale-in group cursor-pointer">
            <Link to="/manager-login">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Manager Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Manage your team members, assign tasks, and track progress
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Admin Portal */}
          <Card className="shadow-2xl border-0 bg-gradient-card hover-lift animate-scale-in group cursor-pointer">
            <Link to="/admin-login">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Full system administration, user management, and API integration controls
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Teams & Departments */}
          <Card className="shadow-2xl border-0 bg-gradient-card hover-lift animate-scale-in group">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Teams & Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Organize employees across different roofing specialties and departments
              </p>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="shadow-2xl border-0 bg-gradient-card hover-lift animate-scale-in group">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Track onboarding completion rates, team performance, and hiring metrics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="text-center space-y-6">
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/onboarding">
              <Button variant="premium" size="lg" className="gap-2 animate-pulse-glow">
                <FileText className="h-5 w-5" />
                Start Onboarding
              </Button>
            </Link>
            
            <Link to="/recruiting">
              <Button variant="glass" size="lg" className="gap-2 hover-glow">
                <Users className="h-5 w-5" />
                View Submissions
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">© 2024 TriGuard Roofing. All rights reserved.</p>
            <p>
              Need help? Contact our HR team at{' '}
              <a 
                href="mailto:hr@triguardroofing.com" 
                className="text-primary hover:text-primary-dark underline-offset-2 hover:underline transition-colors"
              >
                hr@triguardroofing.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
