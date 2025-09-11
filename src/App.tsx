// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GardenProvider } from "@/contexts/GardenContext";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GardenProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            {/* Main Layout with Navigation */}
            <Route path="/" element={<Layout />}>
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
      </TooltipProvider>
    </GardenProvider>
  </QueryClientProvider>
);

export default App;