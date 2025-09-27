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
      {/* Header with Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/95 border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-primary-foreground">TR</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground">TriGuard Roofing</h1>
                <p className="text-xs text-muted-foreground">Employee Management</p>
              </div>
            </div>

            {/* Navigation Menu - Mobile Optimized */}
            <div className="flex items-center gap-1 sm:gap-3">
              <Button 
                size="sm"
                className="text-xs px-2 py-1 sm:px-3 sm:py-2 sm:text-sm"
                onClick={() => window.location.href = '/onboarding'}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Start Onboarding</span>
                <span className="sm:hidden">Start</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs px-2 py-1 sm:px-3 sm:py-2 sm:text-sm"
                onClick={() => window.location.href = '/user-login'}
              >
                <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Employee Login</span>
                <span className="sm:hidden">Login</span>
              </Button>

              <Link to="/login">
                <Button variant="outline" size="sm" className="text-xs px-2 py-1 sm:px-3 sm:py-2 sm:text-sm">
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                  <span className="sm:hidden">Admin</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        {/* Hero Section */}
        <section className="text-center mb-12 sm:mb-16">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 leading-tight px-2">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                TriGuard Roofing
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed px-3">
              Start your journey with us! Our streamlined onboarding process will get you ready for 
              success. Complete your profile, upload your badge photo, and join the team.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground px-3">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-success flex-shrink-0" />
                <span>9-Step Process</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span>15 Min Setup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-warning flex-shrink-0" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </section>

        {/* Primary CTA Section */}
        <section className="flex justify-center mb-12 sm:mb-16 px-3">
          <a 
            href="/onboarding"
            className="flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-xl px-6 sm:px-12 py-4 sm:py-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-sm sm:max-w-none sm:w-auto bg-gradient-to-r from-primary to-accent text-white rounded-xl font-bold no-underline cursor-pointer"
            style={{ pointerEvents: 'auto', zIndex: 10 }}
          >
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
            <span>START ONBOARDING</span>
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
          </a>
        </section>

        {/* Complete Onboarding Experience Section */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12 px-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">Complete Onboarding Experience</h2>
            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to get started with TriGuard Roofing
            </p>
          </div>

          {/* Feature Cards Grid - Mobile First */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-3 sm:px-0">
            {/* Employee Onboarding */}
            <Card className="shadow-lg border-0 bg-gradient-card hover:shadow-xl cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <Button variant="ghost" className="h-full w-full p-0" asChild>
                <Link to="/onboarding">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5"></div>
                  <CardHeader className="text-center relative z-10 py-6 sm:py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                      <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">Personal Information</CardTitle>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Complete your profile and personal details</p>
                  </CardHeader>
                </Link>
              </Button>
            </Card>

            {/* Document Upload */}
            <Card className="shadow-lg border-0 bg-gradient-card hover:shadow-xl cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
              <CardHeader className="text-center relative z-10 py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-success rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-success-foreground" />
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">Secure Documents</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Upload required documents safely and securely</p>
              </CardHeader>
            </Card>

            {/* Team Assignment */}
            <Card className="shadow-lg border-0 bg-gradient-card hover:shadow-xl cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-600/5"></div>
              <CardHeader className="text-center relative z-10 py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">Team Integration</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Get assigned to your team and meet colleagues</p>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Secondary Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 px-3 sm:px-0">
          {/* Recruiting Dashboard */}
          <Card className="shadow-lg border-0 bg-gradient-card hover:shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1">
            <Button variant="ghost" className="h-full w-full p-0" asChild>
              <Link to="/recruiting">
                <CardHeader className="text-center py-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg md:text-xl">Recruiting Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                    View and manage onboarding submissions with CRM-style tools
                  </p>
                </CardContent>
              </Link>
            </Button>
          </Card>

          {/* Teams & Departments */}
          <Card className="shadow-lg border-0 bg-gradient-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="text-center py-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-warning rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-warning-foreground" />
              </div>
              <CardTitle className="text-base sm:text-lg md:text-xl">Teams & Departments</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                Organize employees across roofing specialties and departments
              </p>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="shadow-lg border-0 bg-gradient-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <CardHeader className="text-center py-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <CardTitle className="text-base sm:text-lg md:text-xl">Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                Track completion rates, team performance, and hiring metrics
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 sm:py-8 border-t border-border/50 px-3">
          <div className="space-y-2 sm:space-y-4">
            <p className="text-sm sm:text-base font-medium text-foreground">© 2024 TriGuard Roofing. All rights reserved.</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
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