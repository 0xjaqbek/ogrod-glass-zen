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
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ustawienia</h1>
        <p className="text-foreground-secondary">Personalizuj swoją aplikację</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="space-y-3">
              <div className="flex items-center space-x-2">
                <Icon className="h-5 w-5 text-emerald" />
                <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              </div>
              <Card className="glass-card p-0 overflow-hidden">
                {section.items.map((item, index) => (
                  <div 
                    key={index}
                    className={`
                      flex items-center justify-between p-4 cursor-pointer hover:bg-glass-hover transition-colors
                      ${index < section.items.length - 1 ? 'border-b border-glass-border' : ''}
                    `}
                  >
                    <span className="font-medium text-foreground">{item.label}</span>
                    {item.hasArrow && (
                      <ArrowRight className="h-5 w-5 text-foreground-secondary" />
                    )}
                    {item.hasSwitch && (
                      <Switch 
                        checked={item.enabled} 
                        className="data-[state=checked]:bg-emerald"
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