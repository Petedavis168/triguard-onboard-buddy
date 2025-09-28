import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { OnboardingForm } from "./components/onboarding/OnboardingForm";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ManagerLogin from "./pages/ManagerLogin";
import ManagerPasswordChange from "./pages/ManagerPasswordChange";
import AdminPasswordChange from "./pages/AdminPasswordChange";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserLogin from "./pages/UserLogin";
import UserDashboard from "./pages/UserDashboard";
import RecruitingDashboard from "./pages/RecruitingDashboard";
import Courses from "./pages/Courses";
import CourseContent from "./pages/CourseContent";
import Quizzes from "./pages/Quizzes";
import Certificates from "./pages/Certificates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-password-change" element={<AdminPasswordChange />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseContent />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/manager-login" element={<ManagerLogin />} />
          <Route path="/manager-password-change" element={<ManagerPasswordChange />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/recruiting" element={<RecruitingDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
