// src/pages/Index.tsx
import { useState, useEffect } from "react";
import { useGarden } from "@/contexts/GardenContext";
import GardenDashboard from "@/components/GardenDashboard";
import NavigationBar from "@/components/NavigationBar";
import GardenDetail from "@/components/GardenDetail";
import BedDetail from "@/components/BedDetail";
import PlantDetail from "@/components/PlantDetail";
import HistoryScreen from "@/components/HistoryScreen";
import NotificationsScreen from "@/components/NotificationsScreen";
import SettingsScreen from "@/components/SettingsScreen";

type Screen = "dashboard" | "garden" | "history" | "notifications" | "settings";
type DetailScreen = "garden-detail" | "bed-detail" | "plant-detail";

const Index = () => {
  const { state, dispatch } = useGarden();
  const [activeTab, setActiveTab] = useState<Screen>("dashboard");
  const [detailScreen, setDetailScreen] = useState<DetailScreen | null>(null);
  const [selectedBedId, setSelectedBedId] = useState<string>("");
  const [selectedPlantId, setSelectedPlantId] = useState<string>("");

  // Auto-generate notifications for overdue tasks
  useEffect(() => {
    const checkForOverdueTasks = () => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Find overdue tasks that don't have notifications yet
      const overdueTasks = state.tasks.filter(task => {
        if (task.completed) return false;
        
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        
        const isOverdue = taskDate < today;
        const hasNotification = state.notifications.some(n => 
          n.taskId === task.id && n.type === 'alert'
        );
        
        return isOverdue && !hasNotification;
      });

      // Create notifications for overdue tasks
      overdueTasks.forEach(task => {
        const notification = {
          id: `overdue-alert-${task.id}-${Date.now()}`,
          title: 'Zadanie przeterminowane!',
          message: `${task.title} - termin: ${task.dueDate.toLocaleDateString('pl-PL')}`,
          type: 'alert' as const,
          read: false,
          createdDate: new Date(),
          taskId: task.id,
        };
        
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      });

      // Generate reminders for upcoming tasks (tomorrow)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const upcomingTasks = state.tasks.filter(task => {
        if (task.completed) return false;
        
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        
        const isTomorrow = taskDate.getTime() === tomorrow.getTime();
        const hasReminder = state.notifications.some(n => 
          n.taskId === task.id && n.type === 'reminder'
        );
        
        return isTomorrow && !hasReminder && state.settings.notifications.taskReminders;
      });

      // Create reminders for tomorrow's tasks
      upcomingTasks.forEach(task => {
        const notification = {
          id: `reminder-${task.id}-${Date.now()}`,
          title: 'Przypomnienie o zadaniu',
          message: `Jutro: ${task.title}`,
          type: 'reminder' as const,
          read: false,
          createdDate: new Date(),
          taskId: task.id,
        };
        
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      });
    };

    // Check immediately and then every hour
    checkForOverdueTasks();
    const interval = setInterval(checkForOverdueTasks, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [state.tasks, state.notifications, state.settings.notifications.taskReminders, dispatch]);

  // Auto-generate watering reminders
  useEffect(() => {
    if (!state.settings.notifications.wateringReminders) return;

    const checkWateringNeeds = () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      state.gardens.forEach(garden => {
        garden.beds.forEach(bed => {
          bed.plants.forEach(plant => {
            const needsWatering = !plant.lastWatered || plant.lastWatered < threeDaysAgo;
            const hasWateringNotification = state.notifications.some(n => 
              n.message.includes(plant.name) && n.type === 'reminder' && !n.read
            );

            if (needsWatering && !hasWateringNotification) {
              const notification = {
                id: `watering-${plant.id}-${Date.now()}`,
                title: 'Czas podlać rośliny!',
                message: `${plant.emoji} ${plant.name} w ${bed.name} potrzebuje wody`,
                type: 'reminder' as const,
                read: false,
                createdDate: new Date(),
                plantId: plant.id,
              };
              
              dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
            }
          });
        });
      });
    };

    // Check every 6 hours
    const interval = setInterval(checkWateringNeeds, 6 * 60 * 60 * 1000);
    checkWateringNeeds(); // Check immediately

    return () => clearInterval(interval);
  }, [state.gardens, state.notifications, state.settings.notifications.wateringReminders, dispatch]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Screen);
    setDetailScreen(null);
    
    // Clear selections when switching to main tabs
    if (tab !== "garden") {
      setSelectedBedId("");
      setSelectedPlantId("");
    }
  };

  const handleGardenSelect = () => {
    setDetailScreen("garden-detail");
  };

  const handleBedSelect = (bedId: string) => {
    setSelectedBedId(bedId);
    setDetailScreen("bed-detail");
  };

  const handlePlantSelect = (plantId: string) => {
    setSelectedPlantId(plantId);
    setDetailScreen("plant-detail");
  };

  const handleBack = () => {
    if (detailScreen === "plant-detail") {
      setDetailScreen("bed-detail");
      setSelectedPlantId("");
    } else if (detailScreen === "bed-detail") {
      setDetailScreen("garden-detail");
      setSelectedBedId("");
    } else if (detailScreen === "garden-detail") {
      setDetailScreen(null);
      setActiveTab("dashboard");
    }
  };

  const renderContent = () => {
    // Handle detail screens first
    if (detailScreen === "garden-detail") {
      return <GardenDetail onBack={handleBack} onBedSelect={handleBedSelect} />;
    }

    if (detailScreen === "bed-detail") {
      return <BedDetail bedId={selectedBedId} onBack={handleBack} onPlantSelect={handlePlantSelect} />;
    }

    if (detailScreen === "plant-detail") {
      return <PlantDetail plantId={selectedPlantId} onBack={handleBack} />;
    }

    // Handle main tabs
    switch (activeTab) {
      case "dashboard":
        return <GardenDashboard onGardenSelect={handleGardenSelect} />;
      case "garden":
        // If user has gardens, show the garden detail directly
        if (state.gardens.length > 0) {
          // Auto-select first garden if none selected
          if (!state.selectedGarden) {
            dispatch({ type: 'SELECT_GARDEN', payload: state.gardens[0] });
          }
          return <GardenDetail onBack={() => setActiveTab("dashboard")} onBedSelect={handleBedSelect} />;
        } else {
          // If no gardens, redirect to dashboard
          setActiveTab("dashboard");
          return <GardenDashboard onGardenSelect={handleGardenSelect} />;
        }
      case "history":
        return <HistoryScreen />;
      case "notifications":
        return <NotificationsScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <GardenDashboard onGardenSelect={handleGardenSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="pb-16 sm:pb-24">
        {renderContent()}
      </main>

      {/* Navigation Bar */}
      <NavigationBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;