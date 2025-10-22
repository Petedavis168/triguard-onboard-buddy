import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  // Test console log to ensure component is running  
  console.log("Index component is rendering successfully");
  
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-8">
          TriGuard Roofing
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Employee Onboarding System
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link
            to="/onboarding"
            className="bg-blue-500 hover:bg-blue-600 text-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-3">Start Onboarding</h3>
            <p className="text-blue-100">Begin your journey with our team</p>
          </Link>
          
          <Link
            to="/user-login"
            className="bg-gray-600 hover:bg-gray-700 text-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-2xl font-bold mb-3">Employee Login</h3>
            <p className="text-gray-200">Access your personal dashboard</p>
          </Link>
          
          <Link
            to="/admin-login"
            className="bg-green-500 hover:bg-green-600 text-white p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-2xl font-bold mb-3">Admin Login</h3>
            <p className="text-green-100">Management portal access</p>
          </Link>
        </div>
        
        <div className="mt-16 bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Access</h2>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Link
              to="/manager-login"
              className="flex items-center gap-3 text-purple-600 hover:text-purple-700 font-semibold text-lg transition-all duration-200"
            >
              <span className="text-2xl">👔</span>
              <span>Manager Login</span>
            </Link>
          </div>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500">
            Streamlining your onboarding experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;