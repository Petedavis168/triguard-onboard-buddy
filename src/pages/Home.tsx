import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Settings, FileText, Mail, Shield, Clock } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-8">
              <Badge className="bg-blue-100 text-blue-700 border-blue-300 px-4 py-1.5 text-sm font-medium">
                Employee Onboarding System
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TriGuard Roofing
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Start your journey with us! Our streamlined onboarding process will get you ready 
              for success. Complete your profile, upload your badge photo, and join the team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/onboarding">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 text-lg">
                  Start Onboarding
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/user-login">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-cyan-200 hover:border-cyan-300">
                  <Users className="mr-2 h-5 w-5" />
                  Employee Login
                </Button>
              </Link>
              <Link to="/manager-login">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-green-200 hover:border-green-300">
                  <Users className="mr-2 h-5 w-5" />
                  Manager Portal
                </Button>
              </Link>
              <Link to="/admin-login">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-blue-200 hover:border-blue-300">
                  <Settings className="mr-2 h-5 w-5" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Onboarding Experience</h2>
          <p className="text-gray-600 text-lg">Everything you need to get started with TriGuard Roofing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Basic contact details
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Address information
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Automatic email generation
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Gear & Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Uniform sizing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Safety equipment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Badge photo upload
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  W-9 tax form
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Team assignment
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Manager notification
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple 9-Step Process</h2>
            <p className="text-gray-600 text-lg">Complete your onboarding in just a few minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-9 gap-2">
            {[
              { step: 1, title: 'Basic Info', icon: Users },
              { step: 2, title: 'Address', icon: FileText },
              { step: 3, title: 'Gear Sizing', icon: Shield },
              { step: 4, title: 'Badge Photo', icon: Users },
              { step: 5, title: 'Team', icon: Users },
              { step: 6, title: 'W-9 Form', icon: FileText },
              { step: 7, title: 'Voice Pitch', icon: Mail },
              { step: 8, title: 'Tasks', icon: CheckCircle },
              { step: 9, title: 'Submit', icon: CheckCircle },
            ].map(({ step, title, icon: Icon }, index) => (
              <div key={step} className="text-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  {index < 8 && (
                    <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-blue-200"></div>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-700">Step {step}</div>
                <div className="text-xs text-gray-500">{title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Join the TriGuard Roofing team today. Your onboarding journey begins with a single click.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/onboarding">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                <Clock className="mr-2 h-5 w-5" />
                Start Now - Takes 5 Minutes
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 TriGuard Roofing. All rights reserved.</p>
          <p className="text-gray-400 mt-1">
            Need help? Contact{' '}
            <a href="mailto:onboarding@triguardroofing.com" className="text-blue-400 hover:underline">
              onboarding@triguardroofing.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;