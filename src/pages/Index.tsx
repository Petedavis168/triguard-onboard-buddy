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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      {/* Header with Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 animate-fade-in">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-lg animate-glow-pulse">
                <span className="text-sm sm:text-lg font-bold text-primary-foreground">TR</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">TriGuard Roofing</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Employee Management</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex items-center gap-2 sm:gap-4 animate-fade-in">
              <Button 
                variant="default" 
                className="flex items-center gap-2 text-sm px-3 py-2 hover:shadow-glow transition-all duration-300"
                onClick={() => window.location.href = '/onboarding'}
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Start Onboarding</span>
                <span className="sm:hidden">Onboard</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-sm px-3 py-2 hover:shadow-soft transition-all duration-300"
                onClick={() => window.location.href = '/user-login'}
              >
                <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Employee Login</span>
                <span className="sm:hidden">Login</span>
              </Button>

              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2 hover:shadow-soft transition-all duration-300">
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Admin Login</span>
                  <span className="sm:hidden">Admin</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {/* Hero Section */}
        <section className="text-center mb-16 sm:mb-20 animate-fade-in-up">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-4 animate-fade-in-up">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow-pulse">
                TriGuard Roofing
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4 animate-fade-in delay-200">
              Start your journey with us! Our streamlined onboarding process will get you ready for 
              success. Complete your profile, upload your badge photo, and join the team.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground px-4 animate-fade-in delay-300">
              <div className="flex items-center gap-2 hover:text-success transition-colors duration-300">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                <span className="whitespace-nowrap">9-Step Process</span>
              </div>
              <div className="flex items-center gap-2 hover:text-primary transition-colors duration-300">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="whitespace-nowrap">15 Min Setup</span>
              </div>
              <div className="flex items-center gap-2 hover:text-warning transition-colors duration-300">
                <Shield className="h-4 w-4 text-warning flex-shrink-0" />
                <span className="whitespace-nowrap">Secure & Private</span>
              </div>
            </div>

          </div>
        </section>

        {/* Primary CTA Section */}
        <section className="flex justify-center mb-16 sm:mb-20 px-4 animate-scale-in delay-500">
          <a 
            href="/onboarding"
            className="group flex items-center justify-center gap-3 text-xl px-12 py-6 shadow-2xl hover:shadow-glow transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 min-h-[4rem] bg-gradient-to-r from-primary via-primary-glow to-accent text-white rounded-2xl font-bold no-underline cursor-pointer animate-float"
            style={{ pointerEvents: 'auto', zIndex: 10 }}
          >
            <FileText className="h-6 w-6 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
            <span>START ONBOARDING</span>
            <ArrowRight className="h-6 w-6 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </section>

        {/* Complete Onboarding Experience Section */}
        <section className="mb-20 animate-fade-in-up delay-700">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Complete Onboarding Experience</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to get started with TriGuard Roofing
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Employee Onboarding */}
            <Card className="group shadow-2xl border-0 bg-gradient-card hover:shadow-glow cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-scale-in delay-800">
              <Button variant="ghost" className="h-full w-full p-0" asChild>
                <Link to="/onboarding">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-blue-600/10 group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all duration-500"></div>
                  <CardHeader className="text-center relative z-10 py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 animate-float">
                      <FileText className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                    </div>
                    <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors duration-300">Personal Information</CardTitle>
                    <p className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">Complete your profile and personal details</p>
                  </CardHeader>
                </Link>
              </Button>
            </Card>

            {/* Document Upload */}
            <Card className="group shadow-2xl border-0 bg-gradient-card hover:shadow-glow cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-scale-in delay-900">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-600/10 group-hover:from-green-500/20 group-hover:to-green-600/20 transition-all duration-500"></div>
              <CardHeader className="text-center relative z-10 py-8">
                <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 animate-float delay-100">
                  <Shield className="h-8 w-8 text-success-foreground group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <CardTitle className="text-2xl mb-2 group-hover:text-success transition-colors duration-300">Secure Documents</CardTitle>
                <p className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">Upload required documents safely and securely</p>
              </CardHeader>
            </Card>

            {/* Team Assignment */}
            <Card className="group shadow-2xl border-0 bg-gradient-card hover:shadow-glow cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-scale-in delay-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/10 group-hover:from-purple-500/20 group-hover:to-purple-600/20 transition-all duration-500"></div>
              <CardHeader className="text-center relative z-10 py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 animate-float delay-200">
                  <Users className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <CardTitle className="text-2xl mb-2 group-hover:text-purple-600 transition-colors duration-300">Team Integration</CardTitle>
                <p className="text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">Get assigned to your team and meet colleagues</p>
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