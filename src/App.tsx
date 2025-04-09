import type { FC } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import HomePage from "./pages/HomePage";
import InstructorsPage from "./pages/InstructorsPage";
import InstructorProfilePage from "./pages/InstructorProfilePage";
import JoinInstructorPage from "./pages/JoinInstructorPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageInstructors from "./pages/admin/ManageInstructors";
import AddInstructor from "./pages/admin/AddInstructor";
import EditInstructor from "./pages/admin/EditInstructor";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/instructors/:id" element={<InstructorProfilePage />} />
            <Route path="/join" element={<JoinInstructorPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/instructors" element={
              <AdminProtectedRoute>
                <ManageInstructors />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/add-instructor" element={
              <AdminProtectedRoute>
                <AddInstructor />
              </AdminProtectedRoute>
            } />
            <Route path="/admin/edit-instructor/:id" element={
              <AdminProtectedRoute>
                <EditInstructor />
              </AdminProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
