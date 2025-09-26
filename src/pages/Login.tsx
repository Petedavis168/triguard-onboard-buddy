import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  UserCog, 
  ArrowLeft,
  Users,
  Settings,
  ChevronRight
} from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    console.log('Back to Home button clicked from Login Portal');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:shadow-md transition-all duration-200"
              type="button"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-primary-foreground">TR</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Login Portal
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your portal to access the TriGuard Roofing management system
          </p>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Manager Portal */}
          <Card className="shadow-xl border-0 bg-gradient-card hover:shadow-2xl transition-all duration-300 group cursor-pointer overflow-hidden">
            <Link to="/manager-login" className="block">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-600/10"></div>
              <CardHeader className="text-center relative z-10 pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-200 shadow-xl shadow-purple-500/25">
                  <UserCog className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl mb-4 text-foreground">Manager Portal</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <div className="space-y-4 mb-8">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Access team management tools, assign tasks, and track your team's progress
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 justify-center text-muted-foreground">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span>Team Member Management</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center text-muted-foreground">
                      <Settings className="h-4 w-4 text-purple-500" />
                      <span>Task Assignment & Tracking</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg transition-all"
                  size="lg"
                >
                  Access Manager Portal
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          {/* Admin Portal */}
          <Card className="shadow-xl border-0 bg-gradient-card hover:shadow-2xl transition-all duration-300 group cursor-pointer overflow-hidden">
            <Link to="/admin-login" className="block">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-600/10"></div>
              <CardHeader className="text-center relative z-10 pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-200 shadow-xl shadow-red-500/25">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-3xl mb-4 text-foreground">Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-center relative z-10">
                <div className="space-y-4 mb-8">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Full system administration, user management, and complete access controls
                  </p>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3 justify-center text-muted-foreground">
                      <Shield className="h-4 w-4 text-red-500" />
                      <span>Complete System Access</span>
                    </div>
                    <div className="flex items-center gap-3 justify-center text-muted-foreground">
                      <Settings className="h-4 w-4 text-red-500" />
                      <span>User & API Management</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transition-all"
                  size="lg"
                >
                  Access Admin Dashboard
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="mt-12 text-center">
          <div className="p-6 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Secure Access</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All login sessions are encrypted and monitored for security. 
              Contact IT support if you experience any login issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;