import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl shadow-glow p-8 md:p-12 border border-border/20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              TriGuard Roofing
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Employee Onboarding System
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
            <Link
              to="/onboarding"
              className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl p-6 transition-all duration-300 hover:shadow-glow hover:scale-105 text-center"
            >
              <div className="relative z-10">
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="font-semibold text-lg mb-2">Start Onboarding</h3>
                <p className="text-sm opacity-90">Begin your journey with us</p>
              </div>
            </Link>
            
            <Link
              to="/user-login"
              className="group relative overflow-hidden bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl p-6 transition-all duration-300 hover:shadow-glow hover:scale-105 text-center"
            >
              <div className="relative z-10">
                <div className="text-2xl mb-2">👤</div>
                <h3 className="font-semibold text-lg mb-2">Employee Login</h3>
                <p className="text-sm opacity-90">Access your dashboard</p>
              </div>
            </Link>
            
            <Link
              to="/admin-login"
              className="group relative overflow-hidden bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl p-6 transition-all duration-300 hover:shadow-glow hover:scale-105 text-center"
            >
              <div className="relative z-10">
                <div className="text-2xl mb-2">⚙️</div>
                <h3 className="font-semibold text-lg mb-2">Admin Login</h3>
                <p className="text-sm opacity-90">Management portal</p>
              </div>
            </Link>
          </div>
          
          <div className="bg-muted/30 rounded-xl p-6 border border-border/30">
            <h2 className="text-xl font-semibold text-center mb-6">Quick Access</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/recruiting"
                className="text-primary hover:text-primary/80 font-medium transition-colors underline-offset-4 hover:underline"
              >
                📊 Recruiting Dashboard
              </Link>
              <div className="hidden sm:block text-muted-foreground">•</div>
              <Link
                to="/manager-login"
                className="text-primary hover:text-primary/80 font-medium transition-colors underline-offset-4 hover:underline"
              >
                👔 Manager Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;