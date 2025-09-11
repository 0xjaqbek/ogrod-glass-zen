// src/hooks/useGardenActions.ts
import { useGarden } from '@/contexts/GardenContext';
import { toast } from '@/hooks/use-toast';
import { 
  generatePlantTasks, 
  calculatePlantProgress, 
  shouldAdvancePhase, 
  getNextPhase 
} from '@/utils/gardenUtils';

export const useGardenActions = () => {
  const { 
    state, 
    dispatch, 
    generateId, 
    addActivity,
    addTask,
    completeTask: baseCompleteTask 
  } = useGarden();

  const waterPlant = (gardenId: string, bedId: string, plantId: string) => {
    const garden = state.gardens.find(g => g.id === gardenId);
    const bed = garden?.beds.find(b => b.id === bedId);
    const plant = bed?.plants.find(p => p.id === plantId);

    if (!plant || !garden || !bed) return;

    // Update plant's last watered date
    const updatedPlant = { ...plant, lastWatered: new Date() };
    dispatch({
      type: 'UPDATE_PLANT',
      payload: { gardenId, bedId, plant: updatedPlant }
    });

    // Complete any pending watering tasks for this plant
    const wateringTasks = state.tasks.filter(
      task => task.plantId === plantId && task.type === 'watering' && !task.completed
    );
    
    wateringTasks.forEach(task => {
      baseCompleteTask(task.id, plantId, bedId);
    });

    // Add activity
    addActivity({
      action: `Podlano ${plant.emoji} ${plant.name}`,
      gardenId,
      bedId,
      plantId,
    });

    toast({
      title: "Roślina podlana! 💧",
      description: `${plant.emoji} ${plant.name} została podlana`,
    });
  };

  const advancePlantPhase = (gardenId: string, bedId: string, plantId: string) => {
    const garden = state.gardens.find(g => g.id === gardenId);
    const bed = garden?.beds.find(b => b.id === bedId);
    const plant = bed?.plants.find(p => p.id === plantId);

    if (!plant || !garden || !bed) return;

    if (shouldAdvancePhase(plant)) {
      const nextPhase = getNextPhase(plant.phase);
      const newProgress = calculatePlantProgress(plant);
      
      const updatedPlant = { 
        ...plant, 
        phase: nextPhase,
        progress: newProgress 
      };

      dispatch({
        type: 'UPDATE_PLANT',
        payload: { gardenId, bedId, plant: updatedPlant }
      });

      // Generate new tasks for the new phase
      const newTasks = generatePlantTasks(updatedPlant, gardenId, bedId, generateId);
      newTasks.forEach(task => addTask(task));

      // Add activity
      addActivity({
        action: `${plant.emoji} ${plant.name} przeszła do fazy: ${nextPhase}`,
        gardenId,
        bedId,
        plantId,
      });

      toast({
        title: "Roślina rozwija się! 🌱",
        description: `${plant.emoji} ${plant.name} przeszła do fazy: ${nextPhase}`,
      });

      return true;
    }

    return false;
  };

  const harvestPlant = (gardenId: string, bedId: string, plantId: string, amount?: string) => {
    const garden = state.gardens.find(g => g.id === gardenId);
    const bed = garden?.beds.find(b => b.id === bedId);
    const plant = bed?.plants.find(p => p.id === plantId);

    if (!plant || !garden || !bed) return;

    // Complete any harvesting tasks
    const harvestTasks = state.tasks.filter(
      task => task.plantId === plantId && task.type === 'harvesting' && !task.completed
    );
    
    harvestTasks.forEach(task => {
      baseCompleteTask(task.id, plantId, bedId);
    });

    // Add activity
    const amountText = amount ? ` (${amount})` : '';
    addActivity({
      action: `Zebrano ${plant.emoji} ${plant.name}${amountText}`,
      gardenId,
      bedId,
      plantId,
    });

    toast({
      title: "Zbiory ukończone! 🎉",
      description: `Zebrano ${plant.emoji} ${plant.name}${amountText}`,
    });
  };

  const fertilizePlant = (gardenId: string, bedId: string, plantId: string, fertilizerType?: string) => {
    const garden = state.gardens.find(g => g.id === gardenId);
    const bed = garden?.beds.find(b => b.id === bedId);
    const plant = bed?.plants.find(p => p.id === plantId);

    if (!plant || !garden || !bed) return;

    // Complete any fertilizing tasks
    const fertilizingTasks = state.tasks.filter(
      task => task.plantId === plantId && task.type === 'fertilizing' && !task.completed
    );
    
    fertilizingTasks.forEach(task => {
      baseCompleteTask(task.id, plantId, bedId);
    });

    // Add activity
    const fertilizerText = fertilizerType ? ` (${fertilizerType})` : '';
    addActivity({
      action: `Nawożono ${plant.emoji} ${plant.name}${fertilizerText}`,
      gardenId,
      bedId,
      plantId,
    });

    toast({
      title: "Roślina nawożona! 🌱",
      description: `Nawożono ${plant.emoji} ${plant.name}${fertilizerText}`,
    });
  };

  const removePlant = (gardenId: string, bedId: string, plantId: string) => {
    const garden = state.gardens.find(g => g.id === gardenId);
    const bed = garden?.beds.find(b => b.id === bedId);
    const plant = bed?.plants.find(p => p.id === plantId);

    if (!plant || !garden || !bed) return;

    dispatch({
      type: 'DELETE_PLANT',
      payload: { gardenId, bedId, plantId }
    });

    // Add activity
    addActivity({
      action: `Usunięto ${plant.emoji} ${plant.name} z ${bed.name}`,
      gardenId,
      bedId,
    });

    toast({
      title: "Roślina usunięta",
      description: `${plant.emoji} ${plant.name} została usunięta z grządki`,
    });
  };

  const updatePlantProgress = (gardenId: string, bedId: string, plantId: string) => {
    const garden = state.gardens.find(g => g.id === gardenId);
    const bed = garden?.beds.find(b => b.id === bedId);
    const plant = bed?.plants.find(p => p.id === plantId);

    if (!plant || !garden || !bed) return;

    const newProgress = calculatePlantProgress(plant);
    const updatedPlant = { ...plant, progress: newProgress };

    dispatch({
      type: 'UPDATE_PLANT',
      payload: { gardenId, bedId, plant: updatedPlant }
    });

    // Check if should advance phase
    advancePlantPhase(gardenId, bedId, plantId);
  };

  return {
    waterPlant,
    advancePlantPhase,
    harvestPlant,
    fertilizePlant,
    removePlant,
    updatePlantProgress,
  };
};

// src/hooks/useGardenStats.ts
export const useGardenStats = () => {
  const { state } = useGarden();

  const getOverallStats = () => {
    const totalGardens = state.gardens.length;
    const totalBeds = state.gardens.reduce((sum, garden) => sum + garden.beds.length, 0);
    const totalPlants = state.gardens.reduce((sum, garden) => 
      sum + garden.beds.reduce((bedSum, bed) => bedSum + bed.plants.length, 0), 0
    );
    
    const totalTasks = state.tasks.length;
    const activeTasks = state.tasks.filter(task => !task.completed).length;
    const completedTasks = state.tasks.filter(task => task.completed).length;
    
    const totalActivities = state.activities.length;
    const totalNotifications = state.notifications.length;
    const unreadNotifications = state.notifications.filter(n => !n.read).length;

    return {
      totalGardens,
      totalBeds,
      totalPlants,
      totalTasks,
      activeTasks,
      completedTasks,
      totalActivities,
      totalNotifications,
      unreadNotifications,
    };
  };

  const getGardenStats = (gardenId: string) => {
    const garden = state.gardens.find(g => g.id === gardenId);
    if (!garden) return null;

    const totalBeds = garden.beds.length;
    const totalPlants = garden.beds.reduce((sum, bed) => sum + bed.plants.length, 0);
    const plantsInPhase = garden.beds.reduce((phases, bed) => {
      bed.plants.forEach(plant => {
        phases[plant.phase] = (phases[plant.phase] || 0) + 1;
      });
      return phases;
    }, {} as Record<string, number>);

    const averageProgress = totalPlants > 0 
      ? Math.round(garden.beds.reduce((sum, bed) => 
          sum + bed.plants.reduce((plantSum, plant) => plantSum + plant.progress, 0), 0
        ) / totalPlants)
      : 0;

    const gardenTasks = state.tasks.filter(task => task.gardenId === gardenId);
    const activeGardenTasks = gardenTasks.filter(task => !task.completed);

    return {
      totalBeds,
      totalPlants,
      plantsInPhase,
      averageProgress,
      totalTasks: gardenTasks.length,
      activeTasks: activeGardenTasks.length,
    };
  };

  const getPlantsByCategory = () => {
    const categories: Record<string, number> = {};
    
    state.gardens.forEach(garden => {
      garden.beds.forEach(bed => {
        bed.plants.forEach(plant => {
          // Simple categorization based on plant name
          let category = 'Inne';
          if (['Pomidor', 'Ogórek', 'Papryka'].includes(plant.name)) {
            category = 'Warzywa owocowe';
          } else if (['Sałata', 'Kapusta', 'Brokuły'].includes(plant.name)) {
            category = 'Warzywa liściaste';
          } else if (['Marchew', 'Rzodkiewka', 'Ziemniak'].includes(plant.name)) {
            category = 'Warzywa korzeniowe';
          } else if (['Pietruszka', 'Koper', 'Bazylia'].includes(plant.name)) {
            category = 'Zioła';
          } else if (['Fasolka', 'Groszek'].includes(plant.name)) {
            category = 'Rośliny strączkowe';
          }
          
          categories[category] = (categories[category] || 0) + 1;
        });
      });
    });

    return categories;
  };

  const getTasksByType = () => {
    const taskTypes: Record<string, number> = {};
    
    state.tasks.forEach(task => {
      taskTypes[task.type] = (taskTypes[task.type] || 0) + 1;
    });

    return taskTypes;
  };

  const getActivityTrend = (days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentActivities = state.activities.filter(activity => 
      activity.date >= cutoffDate
    );

    const dailyActivities: Record<string, number> = {};
    
    recentActivities.forEach(activity => {
      const dateKey = activity.date.toISOString().split('T')[0];
      dailyActivities[dateKey] = (dailyActivities[dateKey] || 0) + 1;
    });

    return dailyActivities;
  };

  return {
    getOverallStats,
    getGardenStats,
    getPlantsByCategory,
    getTasksByType,
    getActivityTrend,
  };
};

// src/hooks/useTaskScheduler.ts
export const useTaskScheduler = () => {
  const { state, addTask, generateId } = useGarden();

  const scheduleWateringTask = (plantId: string, bedId: string, gardenId: string, daysFromNow: number = 1) => {
    const garden = state.gardens.find(g => g.id === gardenId);
    const bed = garden?.beds.find(b => b.id === bedId);
    const plant = bed?.plants.find(p => p.id === plantId);

    if (!plant) return;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysFromNow);

    addTask({
      title: `Podlej ${plant.name}`,
      description: `Regularne podlewanie ${plant.emoji} ${plant.name}`,
      plantId,
      bedId,
      gardenId,
      dueDate,
      completed: false,
      type: 'watering',
      priority: 'medium',
    });
  };

  const scheduleHarvestTask = (plantId: string, bedId: string, gardenId: string, estimatedDays: number) => {
    const garden = state.gardens.find(g => g.id === gardenId);
    const bed = garden?.beds.find(b => b.id === bedId);
    const plant = bed?.plants.find(p => p.id === plantId);

    if (!plant) return;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + estimatedDays);

    addTask({
      title: `Sprawdź dojrzałość ${plant.name}`,
      description: `Sprawdź czy ${plant.emoji} ${plant.name} jest gotowe do zbioru`,
      plantId,
      bedId,
      gardenId,
      dueDate,
      completed: false,
      type: 'harvesting',
      priority: 'high',
    });
  };

  const scheduleSeasonalTasks = (gardenId: string) => {
    const month = new Date().getMonth();
    const garden = state.gardens.find(g => g.id === gardenId);
    if (!garden) return;

    const now = new Date();
    let seasonalTasks: string[] = [];

    // Spring tasks (March-May)
    if (month >= 2 && month <= 4) {
      seasonalTasks = [
        'Przygotuj grządki do sezonu',
        'Sprawdź stan gleby',
        'Zaplanuj uprawy na sezon',
      ];
    }
    // Summer tasks (June-August)
    else if (month >= 5 && month <= 7) {
      seasonalTasks = [
        'Mulczuj grządki',
        'Sprawdź system nawadniania',
        'Chroń rośliny przed upałem',
      ];
    }
    // Autumn tasks (September-November)
    else if (month >= 8 && month <= 10) {
      seasonalTasks = [
        'Przygotuj ogród na zimę',
        'Zbierz nasiona na przyszły rok',
        'Uporządkuj narzędzia',
      ];
    }
    // Winter tasks (December-February)
    else {
      seasonalTasks = [
        'Zaplanuj następny sezon',
        'Zamów nasiona i sadzonki',
        'Sprawdź przechowywane plony',
      ];
    }

    seasonalTasks.forEach((taskTitle, index) => {
      const dueDate = new Date(now);
      dueDate.setDate(dueDate.getDate() + (index + 1) * 7); // Spread over weeks

      addTask({
        title: taskTitle,
        description: 'Sezonowe zadanie ogrodnicze',
        gardenId,
        dueDate,
        completed: false,
        type: 'other',
        priority: 'medium',
      });
    });
  };

  return {
    scheduleWateringTask,
    scheduleHarvestTask,
    scheduleSeasonalTasks,
  };
};

// src/hooks/useNotificationManager.ts
export const useNotificationManager = () => {
  const { state, dispatch } = useGarden();

  const createTaskReminder = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const notification = {
      id: `reminder-${taskId}-${Date.now()}`,
      title: 'Przypomnienie o zadaniu',
      message: `${task.title} - ${task.description}`,
      type: 'reminder' as const,
      read: false,
      createdDate: new Date(),
      taskId,
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const createHarvestAlert = (plantId: string) => {
    const plant = state.gardens
      .flatMap(g => g.beds)
      .flatMap(b => b.plants)
      .find(p => p.id === plantId);

    if (!plant) return;

    const notification = {
      id: `harvest-${plantId}-${Date.now()}`,
      title: 'Czas na zbiory! 🎉',
      message: `${plant.emoji} ${plant.name} jest gotowe do zbioru`,
      type: 'alert' as const,
      read: false,
      createdDate: new Date(),
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const createWateringReminder = (plantId: string) => {
    const plant = state.gardens
      .flatMap(g => g.beds)
      .flatMap(b => b.plants)
      .find(p => p.id === plantId);

    if (!plant) return;

    const notification = {
      id: `watering-${plantId}-${Date.now()}`,
      title: 'Czas podlać rośliny! 💧',
      message: `${plant.emoji} ${plant.name} potrzebuje wody`,
      type: 'reminder' as const,
      read: false,
      createdDate: new Date(),
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const markAllAsRead = () => {
    const unreadNotifications = state.notifications.filter(n => !n.read);
    unreadNotifications.forEach(notification => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
    });
  };

  const clearOldNotifications = (daysOld: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const oldNotifications = state.notifications.filter(
      n => n.read && n.createdDate < cutoffDate
    );

    oldNotifications.forEach(notification => {
      dispatch({ type: 'DELETE_NOTIFICATION', payload: notification.id });
    });

    return oldNotifications.length;
  };

  return {
    createTaskReminder,
    createHarvestAlert,
    createWateringReminder,
    markAllAsRead,
    clearOldNotifications,
  };
};