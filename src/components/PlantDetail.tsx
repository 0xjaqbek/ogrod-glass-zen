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
import { ArrowLeft, Droplets, Calendar, CheckCircle, Edit, Trash2, Plus, Sprout, Clock, History, ChevronDown, ChevronUp } from "lucide-react";
import { useGarden } from "@/contexts/GardenContext";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface PlantDetailProps {
  plantId: string;
  onBack: () => void;
}

const PlantDetail = ({ plantId, onBack }: PlantDetailProps) => {
  const { state, dispatch, addTask, addActivity, completeTask, getTodaysTasks, getUpcomingTasks } = useGarden();
  const [isEditPlantOpen, setIsEditPlantOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
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

    // Add activity record
    addActivity({
      action: `Podlano roślinę ${plant.emoji} ${plant.name}`,
      date: new Date(),
      gardenId: selectedGarden.id,
      bedId: bedId,
      plantId: plant.id,
    });

    toast({
      title: "Roślina podlana! 💧",
      description: `${plant.emoji} ${plant.name} została podlana`,
    });
  };

  const handleFertilizePlant = () => {
    // Update plant's last fertilized date
    const updatedPlant = { ...plant, lastFertilized: new Date() };
    dispatch({
      type: 'UPDATE_PLANT',
      payload: { gardenId: selectedGarden.id, bedId, plant: updatedPlant }
    });

    // Complete any fertilizing tasks
    const fertilizingTasks = plantTasks.filter(task => task.type === 'fertilizing' && !task.completed);
    fertilizingTasks.forEach(task => completeTask(task.id, plant.id, bedId));

    // Add activity record
    addActivity({
      action: `Nawożono roślinę ${plant.emoji} ${plant.name}`,
      date: new Date(),
      gardenId: selectedGarden.id,
      bedId: bedId,
      plantId: plant.id,
    });

    toast({
      title: "Roślina nawożona! 🌱",
      description: `${plant.emoji} ${plant.name} została nawożona`,
    });
  };

  // Get plant-specific activities and tasks
  const getPlantHistory = () => {
    const activities = state.activities
      .filter(activity => activity.plantId === plantId)
      .map(activity => ({
        ...activity,
        type: 'activity' as const
      }));

    const tasks = state.tasks
      .filter(task => task.plantId === plantId)
      .map(task => ({
        id: task.id,
        action: task.completed
          ? `Ukończono zadanie: ${task.title}`
          : `Zadanie: ${task.title}`,
        date: task.dueDate,
        gardenId: task.gardenId,
        bedId: task.bedId,
        plantId: task.plantId,
        type: 'task' as const,
        completed: task.completed,
        taskType: task.type
      }));

    return [...activities, ...tasks]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const formatActivityDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={handleWaterPlant}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            size="sm"
          >
            <Droplets className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Podlej
          </Button>
          <Button
            onClick={handleFertilizePlant}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            <Sprout className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Nawieź
          </Button>
          <Button
            onClick={() => setIsAddTaskOpen(true)}
            variant="outline"
            className="glass-button"
            size="sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Zadanie
          </Button>
        </div>
        <div className="mt-2 space-y-1">
          {plant.lastWatered && (() => {
            const wateredDate = new Date(plant.lastWatered);
            const isValidDate = !isNaN(wateredDate.getTime());
            const daysAgo = isValidDate ? Math.floor((Date.now() - wateredDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

            return isValidDate && (
              <p className="text-xs text-foreground-secondary">
                Ostatnio podlana: {daysAgo} dni temu
              </p>
            );
          })()}
          {plant.lastFertilized && (() => {
            const fertilizedDate = new Date(plant.lastFertilized);
            const isValidDate = !isNaN(fertilizedDate.getTime());
            const daysAgo = isValidDate ? Math.floor((Date.now() - fertilizedDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

            return isValidDate && (
              <p className="text-xs text-foreground-secondary">
                Ostatnio nawożona: {daysAgo} dni temu
              </p>
            );
          })()}
        </div>
      </Card>

      {/* Tasks */}
      <div className="space-y-3 sm:space-y-4">
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

      {/* Plant History - Collapsible */}
      <Card className="glass rounded-xl">
        {/* Header Button */}
        <button
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          className="w-full flex items-center justify-between p-3 sm:p-6 hover:bg-glass-hover transition-all duration-300 group rounded-xl"
        >
          <div className="flex items-center space-x-2">
            <History className="h-4 w-4 sm:h-5 sm:w-5 text-emerald flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <h3 className="text-sm sm:text-base font-semibold text-foreground">
              Historia rośliny
            </h3>
            {getPlantHistory().length > 0 && (
              <span className="text-xs text-foreground-secondary">
                ({getPlantHistory().length})
              </span>
            )}
          </div>
          {isHistoryExpanded ? (
            <ChevronUp className="h-5 w-5 text-foreground-secondary transition-transform duration-300" />
          ) : (
            <ChevronDown className="h-5 w-5 text-foreground-secondary transition-transform duration-300" />
          )}
        </button>

        {/* Collapsible Content */}
        <div className={`
          transition-all duration-300 ease-out overflow-hidden
          ${isHistoryExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="px-3 sm:px-6 pb-3 sm:pb-6">
            {getPlantHistory().length > 0 ? (
              <div className="space-y-3">
                {getPlantHistory().slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 bg-emerald/[0.02] dark:bg-emerald/[0.01] rounded-lg">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-emerald/20">
                      {item.type === 'task' ? (
                        item.taskType === 'watering' ? (
                          <Droplets className={`h-4 w-4 ${item.completed ? 'text-blue-500' : 'text-blue-300'}`} />
                        ) : item.taskType === 'fertilizing' ? (
                          <Sprout className={`h-4 w-4 ${item.completed ? 'text-green-500' : 'text-green-300'}`} />
                        ) : item.taskType === 'harvesting' ? (
                          <CheckCircle className={`h-4 w-4 ${item.completed ? 'text-orange-500' : 'text-orange-300'}`} />
                        ) : (
                          <Calendar className={`h-4 w-4 ${item.completed ? 'text-emerald' : 'text-foreground-secondary'}`} />
                        )
                      ) : item.action.includes('Podlano') ? (
                        <Droplets className="h-4 w-4 text-blue-500" />
                      ) : item.action.includes('Nawożono') ? (
                        <Sprout className="h-4 w-4 text-green-500" />
                      ) : item.action.includes('Posadzono') ? (
                        <Plus className="h-4 w-4 text-emerald" />
                      ) : (
                        <Clock className="h-4 w-4 text-foreground-secondary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        item.type === 'task' && !item.completed
                          ? 'text-foreground-secondary'
                          : 'text-foreground'
                      }`}>
                        {item.action}
                      </p>
                      <p className="text-xs text-foreground-secondary">
                        {formatActivityDate(item.date)}
                      </p>
                      {item.type === 'task' && (
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            item.completed
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {item.completed ? 'Ukończone' : 'Oczekuje'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {getPlantHistory().length > 5 && (
                  <p className="text-xs text-foreground-secondary text-center">
                    ...i {getPlantHistory().length - 5} więcej wydarzeń
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="h-6 w-6 text-foreground-secondary mx-auto mb-2" />
                <p className="text-sm text-foreground-secondary">
                  Brak historii dla tej rośliny
                </p>
                <p className="text-xs text-foreground-secondary mt-1">
                  Historia będzie wyświetlana tutaj po wykonaniu akcji
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

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