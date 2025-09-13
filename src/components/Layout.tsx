// src/components/Layout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useGarden } from "@/contexts/GardenContext";
import NavigationBar from "@/components/NavigationBar";

const Layout = () => {
  const { state, dispatch } = useGarden();
  const location = useLocation();

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
          message: `${task.title} - termin: ${new Date(task.dueDate).toLocaleDateString('pl-PL')}`,
          type: 'alert' as const,
          read: false,
          createdDate: new Date(),
          taskId: task.id,
        };
        
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      });

      // Generate reminders for upcoming tasks (tomorrow) - simplified without settings dependency
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
        
        return isTomorrow && !hasReminder;
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
  }, [state.tasks, state.notifications, dispatch]);

  // Auto-generate watering reminders - simplified
  useEffect(() => {
    const checkWateringNeeds = () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      state.gardens.forEach(garden => {
        garden.beds.forEach(bed => {
          bed.plants.forEach(plant => {
            const needsWatering = !plant.lastWatered || new Date(plant.lastWatered) < threeDaysAgo;
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
  }, [state.gardens, state.notifications, dispatch]);

  // Determine active tab based on current route
  const getActiveTab = (pathname: string): string => {
    if (pathname === '/') return 'dashboard';
    if (pathname.startsWith('/gardens')) return 'gardens';
    if (pathname.startsWith('/tasks')) return 'tasks';
    if (pathname.startsWith('/history')) return 'history';
    if (pathname.startsWith('/notifications')) return 'notifications';
    if (pathname.startsWith('/settings') || pathname.startsWith('/profile')) return 'settings';
    return 'dashboard';
  };

  useEffect(() => {
    // Clean up any existing gradient classes first
    const gradientClasses = [
      'bg-gradient-animated',
      'bg-gradient-mesh', 
      'bg-gradient-aurora',
      'bg-gradient-depth'
    ];
    
    gradientClasses.forEach(className => {
      document.body.classList.remove(className);
    });
    
    // Choose ONE of these:
     document.body.classList.add('bg-gradient-animated'); // ✨ Most Dynamic!
   // document.body.classList.add('bg-gradient-mesh');     // 🎨 Complex
    // document.body.classList.add('bg-gradient-aurora');   // 🌈 Flowing
    // document.body.classList.add('bg-gradient-depth');    // 🌊 Layered
    
    // Cleanup function to remove classes when component unmounts
    return () => {
      gradientClasses.forEach(className => {
        document.body.classList.remove(className);
      });
    };
  }, []);


  const activeTab = getActiveTab(location.pathname);

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="pb-20">
        <Outlet />
      </main>

      {/* Navigation Bar */}
      <NavigationBar activeTab={activeTab} />
    </div>
  );
};

export default Layout;