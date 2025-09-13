// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GardenProvider } from "@/contexts/GardenContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { initializeNotifications } from "@/lib/notificationService";

// Pages and Components
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import GardensPage from "@/pages/GardensPage";
import GardenDetailPage from "@/pages/GardenDetailPage";
import BedDetailPage from "@/pages/BedDetailPage";
import PlantDetailPage from "@/pages/PlantDetailPage";
import HistoryPage from "@/pages/HistoryPage";
import NotificationsPage from "@/pages/NotificationsPage";
import SettingsPage from "@/pages/SettingsPage";
import CreateGardenPage from "@/pages/CreateGardenPage";
import CreateBedPage from "@/pages/CreateBedPage";
import CreatePlantPage from "@/pages/CreatePlantPage";
import EditGardenPage from "@/pages/EditGardenPage";
import EditBedPage from "@/pages/EditBedPage";
import EditPlantPage from "@/pages/EditPlantPage";
import TasksPage from "@/pages/TasksPage";
import TaskDetailPage from "@/pages/TaskDetailPage";
import CreateTaskPage from "@/pages/CreateTaskPage";
import ProfilePage from "@/pages/ProfilePage";
import HelpPage from "@/pages/HelpPage";
import AboutPage from "@/pages/AboutPage";
import NotFound from "@/pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      // Initialize notifications when user is logged in
      const initNotifications = async () => {
        try {
          const unsubscribe = await initializeNotifications(currentUser.uid);
          // Store unsubscribe function for cleanup if needed
          return unsubscribe;
        } catch (error) {
          console.error('Failed to initialize notifications:', error);
        }
      };

      initNotifications();
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter
      basename={import.meta.env.BASE_URL}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        {/* Public Routes (Auth) */}
        <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/register" element={currentUser ? <Navigate to="/" replace /> : <RegisterPage />} />
        <Route path="/reset-password" element={currentUser ? <Navigate to="/" replace /> : <ResetPasswordPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* Gardens */}
          <Route path="gardens" element={<GardensPage />} />
          <Route path="gardens/new" element={<CreateGardenPage />} />
          <Route path="gardens/:gardenId" element={<GardenDetailPage />} />
          <Route path="gardens/:gardenId/edit" element={<EditGardenPage />} />
          
          {/* Beds */}
          <Route path="gardens/:gardenId/beds/new" element={<CreateBedPage />} />
          <Route path="gardens/:gardenId/beds/:bedId" element={<BedDetailPage />} />
          <Route path="gardens/:gardenId/beds/:bedId/edit" element={<EditBedPage />} />
          
          {/* Plants */}
          <Route path="gardens/:gardenId/beds/:bedId/plants/new" element={<CreatePlantPage />} />
          <Route path="gardens/:gardenId/beds/:bedId/plants/:plantId" element={<PlantDetailPage />} />
          <Route path="gardens/:gardenId/beds/:bedId/plants/:plantId/edit" element={<EditPlantPage />} />
          
          {/* Tasks */}
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/new" element={<CreateTaskPage />} />
          <Route path="tasks/:taskId" element={<TaskDetailPage />} />
          
          {/* History */}
          <Route path="history" element={<HistoryPage />} />
          
          {/* Notifications */}
          <Route path="notifications" element={<NotificationsPage />} />
          
          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Profile */}
          <Route path="profile" element={<ProfilePage />} />
          
          {/* Help & About */}
          <Route path="help" element={<HelpPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
        
        {/* Redirects for backward compatibility */}
        <Route path="/garden" element={<Navigate to="/gardens" replace />} />
        <Route path="/garden/:gardenId" element={<Navigate to="/gardens/:gardenId" replace />} />
        
        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GardenProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </GardenProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;