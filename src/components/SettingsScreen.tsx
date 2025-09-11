import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Settings, Bell, User } from "lucide-react";

const SettingsScreen = () => {
  const settingSections = [
    {
      title: "Zarządzanie",
      icon: Settings,
      items: [
        { label: "Dodaj nowy ogród", hasArrow: true },
        { label: "Zarządzaj grządkami", hasArrow: true }
      ]
    },
    {
      title: "Powiadomienia", 
      icon: Bell,
      items: [
        { label: "Przypomnienia o podlewaniu", hasSwitch: true, enabled: true },
        { label: "Powiadomienia o zadaniach", hasSwitch: true, enabled: false }
      ]
    },
    {
      title: "Profil",
      icon: User, 
      items: [
        { label: "Informacje o profilu", hasArrow: true },
        { label: "Pomoc i wsparcie", hasArrow: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground">Ustawienia</h1>
        <p className="text-sm sm:text-base text-foreground-secondary">Personalizuj swoją aplikację</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4 sm:space-y-6">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2">
                <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald flex-shrink-0" />
                <h2 className="text-base sm:text-lg font-semibold text-foreground">{section.title}</h2>
              </div>
              <Card className="glass rounded-xl p-0 overflow-hidden">
                {section.items.map((item, index) => (
                  <div 
                    key={index}
                    className={`
                      flex items-center justify-between p-3 sm:p-4 cursor-pointer hover:bg-glass-hover transition-colors
                      ${index < section.items.length - 1 ? 'border-b border-glass-border' : ''}
                    `}
                  >
                    <span className="text-sm sm:text-base font-medium text-foreground min-w-0 flex-1 mr-3">{item.label}</span>
                    {item.hasArrow && (
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground-secondary flex-shrink-0" />
                    )}
                    {item.hasSwitch && (
                      <Switch 
                        checked={item.enabled} 
                        className="data-[state=checked]:bg-emerald flex-shrink-0"
                      />
                    )}
                  </div>
                ))}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsScreen;