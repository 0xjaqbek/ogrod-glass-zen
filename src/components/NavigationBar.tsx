import { Home, Sprout, Clock, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationBar = ({ activeTab, onTabChange }: NavigationBarProps) => {
  const tabs = [
    { id: "dashboard", icon: Home, label: "Dom" },
    { id: "garden", icon: Sprout, label: "Ogród" },
    { id: "history", icon: Clock, label: "Historia" },
    { id: "notifications", icon: Bell, label: "Powiadomienia" },
    { id: "settings", icon: Settings, label: "Ustawienia" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass backdrop-blur-3xl border-t border-glass-border mx-2 sm:mx-4 mb-2 sm:mb-4 rounded-2xl">
        <div className="flex items-center justify-around py-2 sm:py-3 px-1 sm:px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center space-y-0.5 sm:space-y-1 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-300 min-w-0",
                  isActive 
                    ? "bg-emerald/20 text-emerald" 
                    : "text-foreground-secondary hover:text-foreground hover:bg-glass-hover"
                )}
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="text-[10px] sm:text-xs font-medium truncate max-w-[60px] sm:max-w-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;