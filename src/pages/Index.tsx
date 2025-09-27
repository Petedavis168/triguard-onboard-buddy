import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-indigo-200 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto md:max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="mb-6">
              <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-3">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  TriGuard
                </span>
                <br className="md:hidden" />
                <span className="text-slate-800 ml-2 md:ml-0"> Roofing</span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-600 font-medium mt-4">
                Employee Onboarding System
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
            </div>
          </div>
          
          {/* Main Actions */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6 mb-12 md:mb-16">
            <Link
              to="/onboarding"
              className="group block relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1 mobile-card"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10 text-center">
                <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🚀</div>
                <h3 className="font-bold text-xl md:text-2xl mb-3">Start Onboarding</h3>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed">Begin your journey with our team</p>
              </div>
            </Link>
            
            <Link
              to="/user-login"
              className="group block relative overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-500/25 hover:-translate-y-1 mobile-card"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10 text-center">
                <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">👤</div>
                <h3 className="font-bold text-xl md:text-2xl mb-3">Employee Login</h3>
                <p className="text-slate-200 text-sm md:text-base leading-relaxed">Access your personal dashboard</p>
              </div>
            </Link>
            
            <Link
              to="/admin-login"
              className="group block relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-1 mobile-card"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="relative z-10 text-center">
                <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">⚙️</div>
                <h3 className="font-bold text-xl md:text-2xl mb-3">Admin Login</h3>
                <p className="text-emerald-100 text-sm md:text-base leading-relaxed">Management portal access</p>
              </div>
            </Link>
          </div>
          
          {/* Quick Access */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50 shadow-xl">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-center mb-6">Quick Access</h2>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center">
              <Link
                to="/recruiting"
                className="group flex items-center gap-3 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-all duration-200 hover:scale-105 mobile-button"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">📊</span>
                <span className="border-b-2 border-transparent group-hover:border-blue-600 transition-colors duration-200">
                  Recruiting Dashboard
                </span>
              </Link>
              
              <div className="hidden sm:block w-px h-8 bg-slate-300"></div>
              
              <Link
                to="/manager-login"
                className="group flex items-center gap-3 text-purple-600 hover:text-purple-700 font-semibold text-lg transition-all duration-200 hover:scale-105 mobile-button"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">👔</span>
                <span className="border-b-2 border-transparent group-hover:border-purple-600 transition-colors duration-200">
                  Manager Login
                </span>
              </Link>
            </div>
          </div>
          
          {/* Footer */}
          <div className="text-center mt-12 md:mt-16">
            <p className="text-slate-500 text-sm md:text-base">
              Streamlining your onboarding experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;