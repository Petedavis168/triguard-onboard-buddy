import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Settings, 
  UserCheck, 
  Building, 
  FileText,
  BarChart3,
  LogIn,
  ChevronDown,
  Shield,
  UserCog,
  ArrowRight,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5">
      {/* Header with Login Dropdown */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
                <span className="text-lg font-bold text-primary-foreground">TR</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TriGuard Roofing</h1>
                <p className="text-sm text-muted-foreground">Employee Management</p>
              </div>
            </div>

            {/* Login Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 hover-lift">
                  <LogIn className="h-4 w-4" />
                  Login
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border shadow-xl">
                <DropdownMenuItem asChild>
                  <Link to="/manager-login" className="flex items-center gap-3 p-3 hover:bg-primary/10 cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <UserCog className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Manager Portal</p>
                      <p className="text-xs text-muted-foreground">Team management & tasks</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin-login" className="flex items-center gap-3 p-3 hover:bg-destructive/10 cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Admin Portal</p>
                      <p className="text-xs text-muted-foreground">Full system access</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20 animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 animate-pulse-glow">
              <Star className="h-4 w-4" />
              Employee Onboarding System
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse-glow">
                TriGuard Roofing
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Start your journey with us! Our streamlined onboarding process will get you ready for 
              success. Complete your profile, upload your badge photo, and join the team.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/onboarding">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow hover-lift px-8 py-6 text-lg font-semibold">
                  <FileText className="h-5 w-5 mr-2" />
                  Start Onboarding
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              
              <Link to="/user-login">
                <Button variant="outline" size="lg" className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 px-8 py-6 text-lg">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Employee Login
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>9-Step Process</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>15 Min Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-warning" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Onboarding Experience Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Complete Onboarding Experience</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to get started with TriGuard Roofing
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Employee Onboarding */}
            <Card className="shadow-xl border-0 bg-gradient-card hover-lift animate-scale-in group cursor-pointer overflow-hidden">
              <Link to="/onboarding">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10"></div>
                <CardHeader className="text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">Personal Information</CardTitle>
                  <p className="text-muted-foreground">Complete your profile and personal details</p>
                </CardHeader>
              </Link>
            </Card>

            {/* Document Upload */}
            <Card className="shadow-xl border-0 bg-gradient-card hover-lift animate-scale-in group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-600/10"></div>
              <CardHeader className="text-center relative z-10">
                <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="h-8 w-8 text-success-foreground" />
                </div>
                <CardTitle className="text-2xl mb-2">Secure Documents</CardTitle>
                <p className="text-muted-foreground">Upload required documents safely and securely</p>
              </CardHeader>
            </Card>

            {/* Team Assignment */}
            <Card className="shadow-xl border-0 bg-gradient-card hover-lift animate-scale-in group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/10"></div>
              <CardHeader className="text-center relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl mb-2">Team Integration</CardTitle>
                <p className="text-muted-foreground">Get assigned to your team and meet colleagues</p>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Secondary Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Recruiting Dashboard */}
          <Card className="shadow-xl border-0 bg-gradient-card hover-lift animate-scale-in group cursor-pointer">
            <Link to="/recruiting">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Recruiting Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  View and manage onboarding submissions with CRM-style tools
                </p>
              </CardContent>
            </Link>
          </Card>

          {/* Teams & Departments */}
          <Card className="shadow-xl border-0 bg-gradient-card hover-lift animate-scale-in group">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-warning rounded-lg flex items-center justify-center mx-auto mb-4">
                <Building className="h-6 w-6 text-warning-foreground" />
              </div>
              <CardTitle className="text-xl">Teams & Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Organize employees across roofing specialties and departments
              </p>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="shadow-xl border-0 bg-gradient-card hover-lift animate-scale-in group">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Track completion rates, team performance, and hiring metrics
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border/50">
          <div className="space-y-4">
            <p className="font-medium text-foreground">© 2024 TriGuard Roofing. All rights reserved.</p>
            <p className="text-muted-foreground">
              Need help? Contact our HR team at{' '}
              <a 
                href="mailto:hr@triguardroofing.com" 
                className="text-primary hover:text-primary-dark underline-offset-2 hover:underline transition-colors font-medium"
              >
                hr@triguardroofing.com
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;