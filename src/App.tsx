import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-password-change" element={<AdminPasswordChange />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/manager-login" element={<ManagerLogin />} />
          <Route path="/manager-password-change" element={<ManagerPasswordChange />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/recruiting" element={<RecruitingDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
