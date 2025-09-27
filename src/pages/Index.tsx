import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Settings, 
  UserCheck, 
  Building, 
  FileText,
  BarChart3,
  LogIn,
  Shield,
  UserCog,
  ArrowRight,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  console.log('Index component rendered, navigate function:', navigate);

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

            {/* Login Button */}
            <Link to="/login">
              <Button variant="outline" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                TriGuard Roofing
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Start your journey with us! Our streamlined onboarding process will get you ready for 
              success. Complete your profile, upload your badge photo, and join the team.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
              <Link to="/onboarding">
                <Button 
                  size="lg"
                  className="flex items-center gap-3 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  <FileText className="h-5 w-5" />
                  Start Onboarding
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/user-login">
                <Button 
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-3 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  <UserCheck className="h-5 w-5" />
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
            <Card className="shadow-xl border-0 bg-gradient-card group cursor-pointer overflow-hidden">
              <Button variant="ghost" className="h-full w-full p-0" asChild>
                <Link to="/onboarding">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10"></div>
                  <CardHeader className="text-center relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">Personal Information</CardTitle>
                    <p className="text-muted-foreground">Complete your profile and personal details</p>
                  </CardHeader>
                </Link>
              </Button>
            </Card>

            {/* Document Upload */}
            <Card className="shadow-xl border-0 bg-gradient-card group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-600/10"></div>
              <CardHeader className="text-center relative z-10">
                <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="h-8 w-8 text-success-foreground" />
                </div>
                <CardTitle className="text-2xl mb-2">Secure Documents</CardTitle>
                <p className="text-muted-foreground">Upload required documents safely and securely</p>
              </CardHeader>
            </Card>

            {/* Team Assignment */}
            <Card className="shadow-xl border-0 bg-gradient-card group cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/10"></div>
              <CardHeader className="text-center relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
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
          <Card className="shadow-xl border-0 bg-gradient-card group cursor-pointer">
            <Button variant="ghost" className="h-full w-full p-0" asChild>
              <Link to="/recruiting">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
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
            </Button>
          </Card>

          {/* Teams & Departments */}
          <Card className="shadow-xl border-0 bg-gradient-card group">
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
          <Card className="shadow-xl border-0 bg-gradient-card group">
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