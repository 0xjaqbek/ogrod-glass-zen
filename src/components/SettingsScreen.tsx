// src/components/SettingsScreen.tsx
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Settings, Bell, User, Download, Upload, Trash2, AlertTriangle, Info, LogOut, ChevronDown, ChevronUp } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const SettingsScreen = () => {
  const { state, dispatch } = useGarden();
  const { logout } = useAuth();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isClearDataOpen, setIsClearDataOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    dataManagement: false,
    notifications: false,
    preferences: false,
  });
  
  // Local settings state - now with localStorage persistence
  const [localSettings, setLocalSettings] = useState(() => {
    const saved = localStorage.getItem('ogrod-settings');
    return saved ? JSON.parse(saved) : {
      notifications: {
        wateringReminders: true,
        taskReminders: true,
        harvestAlerts: true,
      },
      language: 'pl' as const,
      units: 'metric' as const,
      theme: 'dark' as const,
      colorScheme: 'normal' as const,
    };
  });

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    location: '',
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ogrod-settings', JSON.stringify(localSettings));
  }, [localSettings]);

  const handleSettingChange = (key: string, value: any) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setLocalSettings(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        }
      }));
    } else {
      setLocalSettings(prev => ({
        ...prev,
        [key]: value,
      }));
    }
    
    toast({
      title: "Ustawienia zaktualizowane ✓",
      description: "Zmiany zostały zapisane lokalnie",
    });
  };

  const exportData = () => {
    try {
      const dataToExport = {
        gardens: state.gardens,
        tasks: state.tasks,
        activities: state.activities,
        notifications: state.notifications,
        settings: localSettings,
        exportDate: new Date().toISOString(),
        version: '1.0',
      };
      
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ogrod-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toast({
        title: "Dane wyeksportowane ✓",
        description: "Kopia zapasowa została pobrana",
      });
      
      setIsExportOpen(false);
    } catch (error) {
      toast({
        title: "Błąd eksportu",
        description: "Nie udało się wyeksportować danych",
        variant: "destructive",
      });
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!importedData.gardens || !Array.isArray(importedData.gardens)) {
          throw new Error('Invalid data format');
        }
        
        // Convert date strings back to Date objects
        const processedData = {
          gardens: importedData.gardens.map((garden: any) => ({
            ...garden,
            beds: garden.beds?.map((bed: any) => ({
              ...bed,
              plants: bed.plants?.map((plant: any) => ({
                ...plant,
                plantedDate: new Date(plant.plantedDate),
                lastWatered: plant.lastWatered ? new Date(plant.lastWatered) : undefined,
              })),
            })) || [],
          })),
          tasks: importedData.tasks?.map((task: any) => ({
            ...task,
            dueDate: new Date(task.dueDate),
          })) || [],
          activities: importedData.activities?.map((activity: any) => ({
            ...activity,
            date: new Date(activity.date),
          })) || [],
          notifications: importedData.notifications?.map((notification: any) => ({
            ...notification,
            createdDate: new Date(notification.createdDate),
          })) || [],
          selectedGarden: null,
        };
        
        // Update context state
        Object.keys(processedData).forEach(key => {
          if (key === 'gardens') {
            processedData.gardens.forEach((garden: any) => {
              dispatch({ type: 'ADD_GARDEN', payload: garden });
            });
          } else if (key === 'tasks') {
            processedData.tasks.forEach((task: any) => {
              dispatch({ type: 'ADD_TASK', payload: task });
            });
          } else if (key === 'activities') {
            processedData.activities.forEach((activity: any) => {
              dispatch({ type: 'ADD_ACTIVITY', payload: activity });
            });
          } else if (key === 'notifications') {
            processedData.notifications.forEach((notification: any) => {
              dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
            });
          }
        });
        
        // Update local settings if available
        if (importedData.settings) {
          setLocalSettings(importedData.settings);
        }
        
        toast({
          title: "Dane zaimportowane ✓",
          description: `Przywrócono ${importedData.gardens.length} ogrodów`,
        });
        
        setIsImportOpen(false);
      } catch (error) {
        toast({
          title: "Błąd importu",
          description: "Nieprawidłowy format pliku lub uszkodzone dane",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const clearAllData = () => {
    // Clear all data by dispatching delete actions
    state.gardens.forEach(garden => {
      dispatch({ type: 'DELETE_GARDEN', payload: garden.id });
    });

    state.tasks.forEach(task => {
      dispatch({ type: 'DELETE_TASK', payload: task.id });
    });

    state.activities.forEach(activity => {
      dispatch({ type: 'DELETE_ACTIVITY', payload: activity.id });
    });

    state.notifications.forEach(notification => {
      dispatch({ type: 'DELETE_NOTIFICATION', payload: notification.id });
    });

    toast({
      title: "Dane wyczyszczone",
      description: "Wszystkie dane ogrodu zostały usunięte",
    });

    setIsClearDataOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Error is already handled in AuthContext
    }
  };

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const getAppInfo = () => {
    return {
      gardens: state.gardens.length,
      beds: state.gardens.reduce((sum, garden) => sum + garden.beds.length, 0),
      plants: state.gardens.reduce((sum, garden) => 
        sum + garden.beds.reduce((bedSum, bed) => bedSum + bed.plants.length, 0), 0
      ),
      tasks: state.tasks.length,
      activeTasks: state.tasks.filter(t => !t.completed).length,
      activities: state.activities.length,
      notifications: state.notifications.length,
    };
  };

  const appInfo = getAppInfo();

  const settingSections = [
    {
      key: "dataManagement",
      title: "Zarządzanie danymi",
      icon: Settings,
      items: [
        { 
          label: "Eksportuj dane", 
          description: "Utwórz kopię zapasową swoich danych",
          action: () => setIsExportOpen(true),
          hasArrow: true 
        },
        { 
          label: "Importuj dane", 
          description: "Przywróć dane z kopii zapasowej",
          action: () => setIsImportOpen(true),
          hasArrow: true 
        },
        { 
          label: "Wyczyść wszystkie dane", 
          description: "Usuń wszystkie ogrody i dane",
          action: () => setIsClearDataOpen(true),
          hasArrow: true,
          danger: true
        }
      ]
    },
    {
      key: "notifications",
      title: "Powiadomienia",
      icon: Bell,
      items: [
        { 
          label: "Przypomnienia o podlewaniu", 
          description: "Otrzymuj powiadomienia o potrzebie podlania",
          hasSwitch: true, 
          enabled: localSettings.notifications.wateringReminders,
          onChange: (checked: boolean) => handleSettingChange('notifications.wateringReminders', checked)
        },
        { 
          label: "Powiadomienia o zadaniach", 
          description: "Przypomnienia o zbliżających się zadaniach",
          hasSwitch: true, 
          enabled: localSettings.notifications.taskReminders,
          onChange: (checked: boolean) => handleSettingChange('notifications.taskReminders', checked)
        },
        { 
          label: "Alerty zbiorów", 
          description: "Powiadomienia o gotowych do zbioru roślinach",
          hasSwitch: true, 
          enabled: localSettings.notifications.harvestAlerts,
          onChange: (checked: boolean) => handleSettingChange('notifications.harvestAlerts', checked)
        }
      ]
    },
    {
      key: "preferences",
      title: "Preferencje",
      icon: User,
      items: [
        {
          label: "Schemat kolorów",
          description: "Przełącz między normalnym a odwróconym motywem",
          hasSelect: true,
          value: localSettings.colorScheme,
          options: [
            { value: 'normal', label: 'Ciemny' },
            { value: 'reversed', label: 'Jasny' }
          ],
          onChange: (value: string) => handleSettingChange('colorScheme', value)
        },
        {
          label: "Informacje o profilu",
          description: "Zarządzaj danymi profilu",
          action: () => setIsProfileOpen(true),
          hasArrow: true
        },
        {
          label: "Wyloguj się",
          description: "Zakończ sesję w aplikacji",
          action: handleLogout,
          hasArrow: true,
          danger: true
        }
      ]
    }
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground">Ustawienia</h1>
      </div>

      {/* App Summary */}
      <Card className="glass rounded-xl p-3 sm:p-6">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg sm:text-2xl font-bold text-emerald">{appInfo.gardens}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Ogrody</div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-bold text-emerald">{appInfo.plants}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Rośliny</div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-bold text-emerald">{appInfo.activeTasks}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Aktywne zadania</div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-bold text-emerald">{appInfo.activities}</div>
            <div className="text-xs sm:text-sm text-foreground-secondary">Aktywności</div>
          </div>
        </div>
      </Card>

      {/* Settings Sections - Collapsible */}
      <div className="space-y-4 sm:space-y-6">
        {settingSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections[section.key];
          const ChevronIcon = isExpanded ? ChevronUp : ChevronDown;

          return (
            <div key={section.key} className="space-y-2 sm:space-y-3">
              {/* Section Header Button */}
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between p-4 glass rounded-xl hover:bg-glass-hover transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <h2 className="text-base sm:text-lg font-semibold text-foreground">{section.title}</h2>
                </div>
                <ChevronIcon className={`h-5 w-5 text-foreground-secondary transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-0'}`} />
              </button>

              {/* Collapsible Content */}
              <div className={`
                transition-all duration-300 ease-out overflow-hidden
                ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
              `}>
                <Card className="glass rounded-xl p-0 overflow-hidden">
                  {section.items.map((item, index) => (
                    <div key={index}>
                      <div
                        className={`
                          flex items-center justify-between p-3 sm:p-4 transition-colors
                          ${item.action ? 'cursor-pointer hover:bg-glass-hover' : ''}
                          ${item.danger ? 'hover:bg-red-500/10' : ''}
                        `}
                        onClick={item.action}
                      >
                        <div className="min-w-0 flex-1 mr-3">
                          <div className={`text-sm sm:text-base font-medium ${item.danger ? 'text-red-400' : 'text-foreground'}`}>
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-xs sm:text-sm text-foreground-secondary mt-1">
                              {item.description}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {item.hasArrow && (
                            <ArrowRight className={`h-4 w-4 sm:h-5 sm:w-5 ${item.danger ? 'text-red-400' : 'text-foreground-secondary'}`} />
                          )}
                          {item.hasSwitch && (
                            <Switch
                              checked={item.enabled}
                              onCheckedChange={item.onChange}
                              className="data-[state=checked]:bg-emerald"
                            />
                          )}
                          {item.hasSelect && (
                            <Select value={item.value} onValueChange={item.onChange}>
                              <SelectTrigger className="glass w-32 sm:w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="glass">
                                {item.options?.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                      {index < section.items.length - 1 && (
                        <Separator className="bg-glass-border" />
                      )}
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          );
        })}
      </div>

      {/* App Info */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Info className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
          <h3 className="text-sm sm:text-base font-semibold text-foreground">O aplikacji</h3>
        </div>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Wersja:</span>
            <span className="text-foreground">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Rozmiar danych:</span>
            <span className="text-foreground">
              {Math.round(JSON.stringify(state).length / 1024)} KB
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-secondary">Ostatnia kopia:</span>
            <span className="text-foreground">Nigdy</span>
          </div>
        </div>
      </Card>

      {/* Export Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Eksportuj dane</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-foreground-secondary">
              Zostanie utworzona kopia zapasowa wszystkich Twoich ogrodów, zadań i aktywności w formacie JSON.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-foreground">Ogrody: {appInfo.gardens}</div>
                <div className="font-medium text-foreground">Rośliny: {appInfo.plants}</div>
              </div>
              <div>
                <div className="font-medium text-foreground">Zadania: {appInfo.tasks}</div>
                <div className="font-medium text-foreground">Aktywności: {appInfo.activities}</div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={exportData} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Pobierz kopię zapasową
              </Button>
              <Button variant="ghost" onClick={() => setIsExportOpen(false)} className="flex-1">
                Anuluj
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Importuj dane</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-foreground-secondary">
              Wybierz plik kopii zapasowej (JSON) aby przywrócić swoje dane. To zastąpi wszystkie obecne dane.
            </p>
            <div className="border-2 border-dashed border-glass-border rounded-lg p-4 text-center">
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="h-8 w-8 text-emerald mx-auto mb-2" />
                <div className="text-sm font-medium text-foreground">Kliknij aby wybrać plik</div>
                <div className="text-xs text-foreground-secondary">lub przeciągnij i upuść plik JSON</div>
              </label>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={() => setIsImportOpen(false)} className="flex-1">
                Anuluj
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Data Dialog */}
      <Dialog open={isClearDataOpen} onOpenChange={setIsClearDataOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="text-red-400">Wyczyść wszystkie dane</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-400">
                Ta akcja usunie wszystkie Twoje ogrody, rośliny, zadania i aktywności. Nie można jej cofnąć.
              </p>
            </div>
            <p className="text-sm text-foreground-secondary">
              Przed kontynuowaniem zalecamy utworzenie kopii zapasowej danych.
            </p>
            <div className="flex space-x-2">
              <Button 
                variant="destructive" 
                onClick={clearAllData} 
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Usuń wszystkie dane
              </Button>
              <Button variant="ghost" onClick={() => setIsClearDataOpen(false)} className="flex-1">
                Anuluj
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Informacje o profilu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="profile-name">Imię</Label>
              <Input
                id="profile-name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Twoje imię"
                className="glass"
              />
            </div>
            <div>
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="twoj@email.com"
                className="glass"
              />
            </div>
            <div>
              <Label htmlFor="profile-location">Lokalizacja</Label>
              <Input
                id="profile-location"
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Miasto, kraj"
                className="glass"
              />
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" disabled>
                Zapisz profil
              </Button>
              <Button variant="ghost" onClick={() => setIsProfileOpen(false)} className="flex-1">
                Anuluj
              </Button>
            </div>
            <p className="text-xs text-foreground-secondary">
              Funkcja profilu będzie dostępna w przyszłych wersjach aplikacji.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsScreen;