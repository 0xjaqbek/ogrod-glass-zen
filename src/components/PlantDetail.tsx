// src/components/PlantDetail.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Droplets, Calendar, CheckCircle, Edit, Trash2, Plus } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface PlantDetailProps {
  plantId: string;
  onBack: () => void;
}

const PlantDetail = ({ plantId, onBack }: PlantDetailProps) => {
  const { state, dispatch, addTask, completeTask, getTodaysTasks, getUpcomingTasks } = useGarden();
  const [isEditPlantOpen, setIsEditPlantOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editedPlant, setEditedPlant] = useState({
    name: '',
    emoji: '',
    phase: '',
    progress: 0,
    nextTask: '',
    daysUntilTask: 1,
    notes: '',
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'watering' as 'watering' | 'fertilizing' | 'pruning' | 'harvesting' | 'planting' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high',
    daysUntil: 1,
  });

  const selectedGarden = state.selectedGarden;
  if (!selectedGarden) {
    return (
      <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="glass-button h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-foreground">Nie wybrano ogrodu</h1>
          </div>
        </div>
      </div>
    );
  }

  // Find the plant
  let plant = null;
  let bedId = '';
  for (const bed of selectedGarden.beds) {
    const foundPlant = bed.plants.find(p => p.id === plantId);
    if (foundPlant) {
      plant = foundPlant;
      bedId = bed.id;
      break;
    }
  }

  if (!plant) {
    return (
      <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="glass-button h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-foreground">Nie znaleziono rośliny</h1>
          </div>
        </div>
      </div>
    );
  }

  // Get tasks for this plant
  const allTasks = [...getTodaysTasks(), ...getUpcomingTasks()];
  const plantTasks = allTasks.filter(task => task.plantId === plantId);

  const phases = ['Nasiona', 'Sadzonki', 'Wschody', 'Wzrost', 'Kwitnienie', 'Owocowanie', 'Dojrzewanie', 'Zbiory'];
  const taskTypes = [
    { value: 'watering', label: 'Podlewanie', icon: '💧' },
    { value: 'fertilizing', label: 'Nawożenie', icon: '🌱' },
    { value: 'pruning', label: 'Przycinanie', icon: '✂️' },
    { value: 'harvesting', label: 'Zbiory', icon: '🥕' },
    { value: 'planting', label: 'Sadzenie', icon: '🌱' },
    { value: 'other', label: 'Inne', icon: '📝' },
  ];

  const handleEditPlant = () => {
    setEditedPlant({
      name: plant.name,
      emoji: plant.emoji,
      phase: plant.phase,
      progress: plant.progress,
      nextTask: plant.nextTask,
      daysUntilTask: plant.daysUntilTask,
      notes: plant.notes,
    });
    setIsEditPlantOpen(true);
  };

  const handleSaveEditPlant = () => {
    if (editedPlant.name.trim()) {
      const updatedPlant = {
        ...plant,
        name: editedPlant.name.trim(),
        emoji: editedPlant.emoji,
        phase: editedPlant.phase,
        progress: Math.max(0, Math.min(100, editedPlant.progress)),
        nextTask: editedPlant.nextTask,
        daysUntilTask: editedPlant.daysUntilTask,
        notes: editedPlant.notes.trim(),
      };

      dispatch({
        type: 'UPDATE_PLANT',
        payload: { gardenId: selectedGarden.id, bedId, plant: updatedPlant }
      });

      setIsEditPlantOpen(false);
      toast({
        title: "Roślina zaktualizowana! ✅",
        description: `Zaktualizowano: ${updatedPlant.emoji} ${updatedPlant.name}`,
      });
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + newTask.daysUntil);

      addTask({
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        plantId: plant.id,
        bedId,
        gardenId: selectedGarden.id,
        dueDate,
        completed: false,
        type: newTask.type,
        priority: newTask.priority,
      });

      setNewTask({
        title: '',
        description: '',
        type: 'watering',
        priority: 'medium',
        daysUntil: 1,
      });
      setIsAddTaskOpen(false);

      toast({
        title: "Zadanie dodane! 📋",
        description: `Utworzono: ${newTask.title}`,
      });
    }
  };

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId, plant.id, bedId);
    const task = plantTasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: "Zadanie wykonane! ✅",
        description: `Ukończono: ${task.title}`,
      });
    }
  };

  const handleWaterPlant = () => {
    // Update plant's last watered date
    const updatedPlant = { ...plant, lastWatered: new Date() };
    dispatch({
      type: 'UPDATE_PLANT',
      payload: { gardenId: selectedGarden.id, bedId, plant: updatedPlant }
    });

    // Complete any watering tasks
    const wateringTasks = plantTasks.filter(task => task.type === 'watering' && !task.completed);
    wateringTasks.forEach(task => completeTask(task.id, plant.id, bedId));

    toast({
      title: "Roślina podlana! 💧",
      description: `${plant.emoji} ${plant.name} została podlana`,
    });
  };

  const getPhaseColor = (phase: string) => {
    const phaseColors = {
      'Nasiona': 'bg-amber-500/20 text-amber-500 border-amber-500/30',
      'Sadzonki': 'bg-green-500/20 text-green-500 border-green-500/30',
      'Wschody': 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
      'Wzrost': 'bg-teal-500/20 text-teal-500 border-teal-500/30',
      'Kwitnienie': 'bg-purple-500/20 text-purple-500 border-purple-500/30',
      'Owocowanie': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
      'Dojrzewanie': 'bg-red-500/20 text-red-500 border-red-500/30',
      'Zbiory': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    };
    return phaseColors[phase as keyof typeof phaseColors] || 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      'medium': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      'high': 'bg-red-500/20 text-red-500 border-red-500/30',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const formatDaysUntil = (days: number) => {
    if (days === 0) return 'Dzisiaj';
    if (days === 1) return 'Jutro';
    if (days < 0) return `${Math.abs(days)} dni temu`;
    return `Za ${days} dni`;
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="glass-button h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl">{plant.emoji}</span>
              <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
                {plant.name}
              </h1>
            </div>
            <Badge variant="secondary" className={`glass text-xs sm:text-sm ${getPhaseColor(plant.phase)}`}>
              {plant.phase}
            </Badge>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleEditPlant}
          className="glass-button h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
        >
          <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {/* Growth Progress */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm sm:text-base font-semibold text-foreground">Faza wzrostu</h3>
            <span className="text-xs sm:text-sm text-foreground-secondary">{plant.progress}%</span>
          </div>
          <Progress value={plant.progress} className="h-2" />
          <p className="text-xs sm:text-sm text-foreground-secondary">
            Aktualnie w fazie: {plant.phase}
          </p>
          {plant.plantedDate && (
            <p className="text-xs text-foreground-secondary">
              Posadzona: {plant.plantedDate.toLocaleDateString('pl-PL')} 
              ({Math.floor((Date.now() - plant.plantedDate.getTime()) / (1000 * 60 * 60 * 24))} dni temu)
            </p>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="glass rounded-xl p-3 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3">Szybkie akcje</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={handleWaterPlant}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            size="sm"
          >
            <Droplets className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Podlej
          </Button>
          <Button 
            onClick={() => setIsAddTaskOpen(true)}
            variant="outline"
            className="glass-button"
            size="sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Dodaj zadanie
          </Button>
        </div>
        {plant.lastWatered && (
          <p className="text-xs text-foreground-secondary mt-2">
            Ostatnio podlana: {Math.floor((Date.now() - plant.lastWatered.getTime()) / (1000 * 60 * 60 * 24))} dni temu
          </p>
        )}
      </Card>

      {/* Tasks */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Zadania</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAddTaskOpen(true)}
            className="glass-button"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Dodaj
          </Button>
        </div>

        {plantTasks.length > 0 ? (
          <div className="space-y-2">
            {plantTasks.map((task) => {
              // Safely calculate days until task
              let daysUntil = 0;
              if (task.dueDate) {
                const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
                if (!isNaN(taskDate.getTime())) {
                  daysUntil = Math.ceil((taskDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  console.log(`PlantDetail: Task ${task.title} dueDate calculation:`, {
                    originalDueDate: task.dueDate,
                    taskDate: taskDate,
                    now: new Date(),
                    daysUntil: daysUntil
                  });
                } else {
                  console.warn(`PlantDetail: Invalid date for task ${task.title}:`, task.dueDate);
                }
              } else {
                console.warn(`PlantDetail: No dueDate for task ${task.title}`);
              }

              const taskType = taskTypes.find(t => t.value === task.type);
              
              return (
                <Card key={task.id} className="glass rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <span className="text-lg flex-shrink-0">{taskType?.icon}</span>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-foreground">{task.title}</h4>
                        {task.description && (
                          <p className="text-xs text-foreground-secondary">{task.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority === 'low' ? 'Niski' : task.priority === 'medium' ? 'Średni' : 'Wysoki'}
                          </Badge>
                          <span className="text-xs text-foreground-secondary">
                            {formatDaysUntil(daysUntil)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCompleteTask(task.id)}
                      className="bg-emerald hover:bg-emerald-light emerald-glow flex-shrink-0"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="glass rounded-lg p-4 text-center">
            <p className="text-foreground-secondary text-sm">Brak zadań dla tej rośliny</p>
          </Card>
        )}
      </div>

      {/* Plant Notes */}
      {plant.notes && (
        <Card className="glass rounded-xl p-3 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">Notatki</h3>
          <p className="text-xs sm:text-sm text-foreground-secondary">{plant.notes}</p>
        </Card>
      )}

      {/* Edit Plant Dialog */}
      <Dialog open={isEditPlantOpen} onOpenChange={setIsEditPlantOpen}>
        <DialogContent className="glass max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edytuj roślinę</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nazwa rośliny</Label>
                <Input
                  id="edit-name"
                  value={editedPlant.name}
                  onChange={(e) => setEditedPlant(prev => ({ ...prev, name: e.target.value }))}
                  className="glass"
                />
              </div>
              <div>
                <Label htmlFor="edit-emoji">Emoji</Label>
                <Input
                  id="edit-emoji"
                  value={editedPlant.emoji}
                  onChange={(e) => setEditedPlant(prev => ({ ...prev, emoji: e.target.value }))}
                  className="glass"
                  maxLength={2}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-phase">Faza wzrostu</Label>
              <Select 
                value={editedPlant.phase}
                onValueChange={(value) => setEditedPlant(prev => ({ ...prev, phase: value }))}
              >
                <SelectTrigger className="glass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {phases.map((phase) => (
                    <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-progress">Postęp (%)</Label>
              <Input
                id="edit-progress"
                type="number"
                min="0"
                max="100"
                value={editedPlant.progress}
                onChange={(e) => setEditedPlant(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                className="glass"
              />
            </div>

            <div>
              <Label htmlFor="edit-notes">Notatki</Label>
              <Textarea
                id="edit-notes"
                value={editedPlant.notes}
                onChange={(e) => setEditedPlant(prev => ({ ...prev, notes: e.target.value }))}
                className="glass"
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSaveEditPlant} className="flex-1">
                Zapisz zmiany
              </Button>
              <Button variant="ghost" onClick={() => setIsEditPlantOpen(false)} className="flex-1">
                Anuluj
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle>Dodaj zadanie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Tytuł zadania</Label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="np. Podlej roślinę"
                className="glass"
              />
            </div>

            <div>
              <Label htmlFor="task-description">Opis</Label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Dodatkowe szczegóły..."
                className="glass"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-type">Typ zadania</Label>
                <Select 
                  value={newTask.type}
                  onValueChange={(value: any) => setNewTask(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    {taskTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="task-priority">Priorytet</Label>
                <Select 
                  value={newTask.priority}
                  onValueChange={(value: any) => setNewTask(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="glass">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    <SelectItem value="low">Niski</SelectItem>
                    <SelectItem value="medium">Średni</SelectItem>
                    <SelectItem value="high">Wysoki</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="task-days">Termin (za ile dni)</Label>
              <Input
                id="task-days"
                type="number"
                min="0"
                max="30"
                value={newTask.daysUntil}
                onChange={(e) => setNewTask(prev => ({ ...prev, daysUntil: parseInt(e.target.value) || 1 }))}
                className="glass"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleAddTask} className="flex-1" disabled={!newTask.title.trim()}>
                Dodaj zadanie
              </Button>
              <Button variant="ghost" onClick={() => setIsAddTaskOpen(false)} className="flex-1">
                Anuluj
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlantDetail;