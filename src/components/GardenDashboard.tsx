// src/components/GardenDashboard.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Droplets, Sprout, ArrowRight, CheckCircle, Calendar } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface GardenDashboardProps {
  onGardenSelect?: () => void;
}

const GardenDashboard = ({ onGardenSelect }: GardenDashboardProps) => {
  const { 
    state, 
    getTodaysTasks, 
    getUpcomingTasks, 
    completeTask, 
    addGarden,
    dispatch 
  } = useGarden();
  
  const [isAddGardenOpen, setIsAddGardenOpen] = useState(false);
  const [newGardenName, setNewGardenName] = useState('');

  const todaysTasks = getTodaysTasks();
  const upcomingTasks = getUpcomingTasks();
  const totalTasks = todaysTasks.length + upcomingTasks.length;
  
  const handleCompleteTask = (taskId: string) => {
    const task = [...todaysTasks, ...upcomingTasks].find(t => t.id === taskId);
    if (task) {
      completeTask(taskId, task.plantId, task.bedId);
      toast({
        title: "Zadanie wykonane! ✅",
        description: `Ukończono: ${task.title}`,
      });
    }
  };

  const handleAddGarden = () => {
    if (newGardenName.trim()) {
      addGarden({
        name: newGardenName.trim(),
        beds: [],
      });
      setNewGardenName('');
      setIsAddGardenOpen(false);
      toast({
        title: "Ogród utworzony! 🌱",
        description: `Dodano nowy ogród: ${newGardenName}`,
      });
    }
  };

  const handleGardenSelect = (gardenId?: string) => {
    if (gardenId && state.gardens.length > 0) {
      const garden = state.gardens.find(g => g.id === gardenId) || state.gardens[0];
      dispatch({ type: 'SELECT_GARDEN', payload: garden });
    } else if (state.gardens.length > 0) {
      dispatch({ type: 'SELECT_GARDEN', payload: state.gardens[0] });
    }
    onGardenSelect?.();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Przed chwilą';
    if (diffInHours < 24) return `${diffInHours}h temu`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Wczoraj';
    return `${diffInDays} dni temu`;
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Dzień dobry! 🌱
          </h1>
          <p className="text-sm sm:text-base text-foreground-secondary">
            {state.gardens.length === 0 
              ? 'Utwórz swój pierwszy ogród' 
              : 'Sprawdź swój ogród dziś'
            }
          </p>
        </div>
        <Dialog open={isAddGardenOpen} onOpenChange={setIsAddGardenOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="glass-button emerald-glow rounded-full h-8 w-8 sm:h-10 sm:w-10"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="glass">
            <DialogHeader>
              <DialogTitle>Dodaj nowy ogród</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="garden-name">Nazwa ogrodu</Label>
                <Input
                  id="garden-name"
                  value={newGardenName}
                  onChange={(e) => setNewGardenName(e.target.value)}
                  placeholder="np. Mój ogród warzywny"
                  className="glass"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddGarden} className="flex-1">
                  Utwórz ogród
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsAddGardenOpen(false)}
                  className="flex-1"
                >
                  Anuluj
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's Stats */}
      {state.gardens.length > 0 && (
        <Card className="glass rounded-xl p-3 sm:p-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 rounded-lg bg-emerald/20 emerald-glow">
              <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-emerald" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                {totalTasks === 0 ? 'Brak zadań' : `${totalTasks} ${totalTasks === 1 ? 'zadanie' : totalTasks < 5 ? 'zadania' : 'zadań'} dzisiaj`}
              </h3>
              <p className="text-xs sm:text-sm text-foreground-secondary">
                {totalTasks === 0 ? 'Świetna robota!' : 'Do wykonania'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Today's Tasks */}
      {todaysTasks.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Dzisiaj</h2>
          <div className="space-y-3">
            {todaysTasks.slice(0, 3).map((task) => (
              <Card key={task.id} className="glass rounded-xl p-3 sm:p-6 glass-hover">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="p-2 sm:p-3 rounded-lg bg-emerald/20">
                      {task.type === 'watering' ? (
                        <Droplets className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
                      ) : (
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-foreground">
                        {task.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-foreground-secondary">
                        {task.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCompleteTask(task.id)}
                    className="bg-emerald hover:bg-emerald-light emerald-glow flex-shrink-0"
                  >
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Gotowe
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          {todaysTasks.length > 3 && (
            <p className="text-xs text-foreground-secondary text-center">
              ...i {todaysTasks.length - 3} więcej zadań
            </p>
          )}
        </div>
      )}

      {/* Gardens Section */}
      {state.gardens.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            {state.gardens.length === 1 ? 'Ogród' : 'Ogrody'}
          </h2>
          <div className="space-y-3">
            {state.gardens.map((garden) => {
              const bedCount = garden.beds.length;
              const plantCount = garden.beds.reduce((sum, bed) => sum + bed.plants.length, 0);
              
              return (
                <Card 
                  key={garden.id} 
                  className="glass rounded-xl p-3 sm:p-6 glass-hover cursor-pointer" 
                  onClick={() => handleGardenSelect(garden.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 rounded-lg bg-emerald/20">
                        <Sprout className="h-4 w-4 sm:h-5 sm:w-5 text-emerald" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-medium text-foreground">
                          {garden.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-foreground-secondary">
                          {bedCount === 0 
                            ? 'Brak grządek' 
                            : `${bedCount} ${bedCount === 1 ? 'grządka' : bedCount < 5 ? 'grządki' : 'grządek'}, ${plantCount} ${plantCount === 1 ? 'roślina' : plantCount < 5 ? 'rośliny' : 'roślin'}`
                          }
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-foreground-secondary flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Activities */}
      {state.activities.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Ostatnie aktywności</h2>
          <div className="space-y-2">
            {state.activities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{activity.action}</span>
                <span className="text-foreground-secondary text-xs">
                  {formatTimeAgo(activity.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {state.gardens.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 rounded-full bg-emerald/20 mb-4">
            <Sprout className="h-8 w-8 text-emerald" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Zacznij swoją przygodę z ogrodnictwem!
          </h3>
          <p className="text-foreground-secondary mb-4 max-w-sm">
            Utwórz swój pierwszy ogród i zacznij zarządzać roślinami, grządkami i zadaniami.
          </p>
          <Button 
            onClick={() => setIsAddGardenOpen(true)}
            className="emerald-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Utwórz pierwszy ogród
          </Button>
        </div>
      )}

      {/* Floating Action Button */}
      {state.gardens.length > 0 && (
        <div className="fixed bottom-16 sm:bottom-24 right-3 sm:right-6">
          <Button 
            size="lg" 
            onClick={() => setIsAddGardenOpen(true)}
            className="glass-button emerald-glow-strong rounded-full h-12 w-12 sm:h-14 sm:w-14 bg-emerald hover:bg-emerald-light shadow-2xl"
          >
            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default GardenDashboard;