// src/components/NavigationBar.tsx
import { Home, Sprout, Clock, Bell, Settings, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGarden } from "@/contexts/GardenContext";
import { useNavigate, useLocation } from "react-router-dom";

interface NavigationBarProps {
  activeTab: string;
}

const NavigationBar = ({ activeTab }: NavigationBarProps) => {
  const { state, getTodaysTasks, getUpcomingTasks } = useGarden();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "dashboard", icon: Home, label: "", path: "/" },
    { id: "gardens", icon: Sprout, label: "", path: "/gardens" },
    { id: "tasks", icon: CheckSquare, label: "", path: "/tasks" },
    { id: "notifications", icon: Bell, label: "", path: "/notifications" },
    { id: "settings", icon: Settings, label: "", path: "/settings" },
  ];

  // Calculate badge counts
  const getBadgeCount = (tabId: string) => {
    switch (tabId) {
      case 'dashboard':
        { const todaysTasks = getTodaysTasks();
        return todaysTasks.length; } // Only show today's tasks

      case 'tasks':
        { const todaysTasks = getTodaysTasks();
        return todaysTasks.length; } // Only show today's tasks
        
      case 'notifications':
        { const unreadNotifications = state.notifications.filter(n => !n.read).length;
        // Calculate overdue tasks using consistent date logic
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const overdueTasks = state.tasks.filter(task => {
          if (task.completed || !task.dueDate) return false;

          const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
          if (isNaN(taskDate.getTime())) return false;

          const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
          return taskDateOnly.getTime() < today.getTime();
        }).length;
        return unreadNotifications + overdueTasks; }
        
      case 'gardens':
        // Show badge if user has no gardens
        return state.gardens.length === 0 ? 1 : 0;
        
      default:
        return 0;
    }
  };

  const getTabColor = (tabId: string, isActive: boolean) => {
    if (isActive) {
      return "bg-emerald/20 text-emerald";
    }
    
    const badgeCount = getBadgeCount(tabId);
    if (badgeCount > 0 && tabId !== 'dashboard') {
      return "text-orange-400 hover:text-emerald hover:bg-glass-hover";
    }
    
    return "text-foreground-secondary hover:text-foreground hover:bg-glass-hover";
  };

  const handleTabClick = (tab: { path: string; }) => {
    navigate(tab.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass backdrop-blur-3xl border-t border-glass-border mx-2 sm:mx-4 mb-2 sm:mb-4 rounded-2xl">
        <div className="flex items-center justify-around py-2 sm:py-3 px-1 sm:px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const badgeCount = getBadgeCount(tab.id);
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={cn(
                  "relative flex flex-col items-center space-y-0.5 sm:space-y-1 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-300 min-w-0",
                  getTabColor(tab.id, isActive)
                )}
              >
                <div className="relative">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  {badgeCount > 0 && (
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "absolute -top-2 -right-2 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px] sm:text-xs font-bold min-w-4 sm:min-w-5",
                        tab.id === 'notifications' && badgeCount > 0
                          ? "bg-red-500 text-white border-red-600/30"
                          : tab.id === 'dashboard' && badgeCount > 0
                          ? "bg-orange-500 text-white border-orange-600/30"
                          : "bg-emerald text-white border-emerald-light/30"
                      )}
                    >
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </Badge>
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-medium truncate max-w-[80px] sm:max-w-none">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;