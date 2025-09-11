import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Types
export interface Plant {
  id: string;
  name: string;
  emoji: string;
  phase: 'planted' | 'growing' | 'flowering' | 'fruiting' | 'mature';
  progress: number;
  plantedDate: Date;
  lastWatered?: Date;
  variety?: string;
  notes?: string;
}

export interface Bed {
  id: string;
  name: string;
  plants: Plant[];
  size?: string;
  soilType?: string;
  location?: string;
}

export interface Garden {
  id: string;
  name: string;
  beds: Bed[];
  location?: string;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  type: 'watering' | 'fertilizing' | 'harvesting' | 'pruning' | 'other';
  priority: 'low' | 'medium' | 'high';
  plantId?: string;
  bedId?: string;
  gardenId: string;
}

export interface Activity {
  id: string;
  action: string;
  date: Date;
  gardenId: string;
  bedId?: string;
  plantId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'alert' | 'reminder';
  read: boolean;
  createdDate: Date;
  taskId?: string;
}

export interface GardenState {
  gardens: Garden[];
  selectedGarden: Garden | null;
  tasks: Task[];
  activities: Activity[];
  notifications: Notification[];
}

// Actions
export type GardenAction =
  | { type: 'ADD_GARDEN'; payload: Omit<Garden, 'id'> }
  | { type: 'UPDATE_GARDEN'; payload: Garden }
  | { type: 'DELETE_GARDEN'; payload: string }
  | { type: 'SELECT_GARDEN'; payload: Garden }
  | { type: 'ADD_BED'; payload: { gardenId: string; bed: Omit<Bed, 'id'> } }
  | { type: 'UPDATE_BED'; payload: { gardenId: string; bed: Bed } }
  | { type: 'DELETE_BED'; payload: { gardenId: string; bedId: string } }
  | { type: 'ADD_PLANT'; payload: { gardenId: string; bedId: string; plant: Omit<Plant, 'id'> } }
  | { type: 'UPDATE_PLANT'; payload: { gardenId: string; bedId: string; plant: Plant } }
  | { type: 'DELETE_PLANT'; payload: { gardenId: string; bedId: string; plantId: string } }
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id'> }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'ADD_ACTIVITY'; payload: Omit<Activity, 'id'> }
  | { type: 'DELETE_ACTIVITY'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'DELETE_NOTIFICATION'; payload: string };

// Initial State
const initialState: GardenState = {
  gardens: [],
  selectedGarden: null,
  tasks: [],
  activities: [],
  notifications: [],
};

// Reducer
const gardenReducer = (state: GardenState, action: GardenAction): GardenState => {
  switch (action.type) {
    case 'ADD_GARDEN':
      { const newGarden: Garden = {
        ...action.payload,
        id: generateId(),
      };
      return {
        ...state,
        gardens: [...state.gardens, newGarden],
      }; }

    case 'UPDATE_GARDEN':
      return {
        ...state,
        gardens: state.gardens.map(garden =>
          garden.id === action.payload.id ? action.payload : garden
        ),
        selectedGarden: state.selectedGarden?.id === action.payload.id ? action.payload : state.selectedGarden,
      };

    case 'DELETE_GARDEN':
      return {
        ...state,
        gardens: state.gardens.filter(garden => garden.id !== action.payload),
        selectedGarden: state.selectedGarden?.id === action.payload ? null : state.selectedGarden,
      };

    case 'SELECT_GARDEN':
      return {
        ...state,
        selectedGarden: action.payload,
      };

    case 'ADD_BED':
      { const newBed: Bed = {
        ...action.payload.bed,
        id: generateId(),
      };
      return {
        ...state,
        gardens: state.gardens.map(garden =>
          garden.id === action.payload.gardenId
            ? { ...garden, beds: [...garden.beds, newBed] }
            : garden
        ),
      }; }

    case 'UPDATE_BED':
      return {
        ...state,
        gardens: state.gardens.map(garden =>
          garden.id === action.payload.gardenId
            ? {
                ...garden,
                beds: garden.beds.map(bed =>
                  bed.id === action.payload.bed.id ? action.payload.bed : bed
                ),
              }
            : garden
        ),
      };

    case 'DELETE_BED':
      return {
        ...state,
        gardens: state.gardens.map(garden =>
          garden.id === action.payload.gardenId
            ? {
                ...garden,
                beds: garden.beds.filter(bed => bed.id !== action.payload.bedId),
              }
            : garden
        ),
      };

    case 'ADD_PLANT':
      { const newPlant: Plant = {
        ...action.payload.plant,
        id: generateId(),
      };
      return {
        ...state,
        gardens: state.gardens.map(garden =>
          garden.id === action.payload.gardenId
            ? {
                ...garden,
                beds: garden.beds.map(bed =>
                  bed.id === action.payload.bedId
                    ? { ...bed, plants: [...bed.plants, newPlant] }
                    : bed
                ),
              }
            : garden
        ),
      }; }

    case 'UPDATE_PLANT':
      return {
        ...state,
        gardens: state.gardens.map(garden =>
          garden.id === action.payload.gardenId
            ? {
                ...garden,
                beds: garden.beds.map(bed =>
                  bed.id === action.payload.bedId
                    ? {
                        ...bed,
                        plants: bed.plants.map(plant =>
                          plant.id === action.payload.plant.id ? action.payload.plant : plant
                        ),
                      }
                    : bed
                ),
              }
            : garden
        ),
      };

    case 'DELETE_PLANT':
      return {
        ...state,
        gardens: state.gardens.map(garden =>
          garden.id === action.payload.gardenId
            ? {
                ...garden,
                beds: garden.beds.map(bed =>
                  bed.id === action.payload.bedId
                    ? {
                        ...bed,
                        plants: bed.plants.filter(plant => plant.id !== action.payload.plantId),
                      }
                    : bed
                ),
              }
            : garden
        ),
      };

    case 'ADD_TASK':
      { const newTask: Task = {
        ...action.payload,
        id: generateId(),
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      }; }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };

    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: true }
            : task
        ),
      };

    case 'ADD_ACTIVITY':
      { const newActivity: Activity = {
        ...action.payload,
        id: generateId(),
      };
      return {
        ...state,
        activities: [...state.activities, newActivity],
      }; }

    case 'DELETE_ACTIVITY':
      return {
        ...state,
        activities: state.activities.filter(activity => activity.id !== action.payload),
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };

    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload),
      };

    default:
      return state;
  }
};

// Helper function to generate IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Context
export interface GardenContextType {
  state: GardenState;
  dispatch: React.Dispatch<GardenAction>;
  generateId: () => string;
  
  // Garden actions
  addGarden: (garden: Omit<Garden, 'id'>) => void;
  updateGarden: (garden: Garden) => void;
  deleteGarden: (gardenId: string) => void;
  selectGarden: (garden: Garden) => void;
  
  // Bed actions
  addBed: (gardenId: string, bed: Omit<Bed, 'id'>) => void;
  updateBed: (gardenId: string, bed: Bed) => void;
  deleteBed: (gardenId: string, bedId: string) => void;
  
  // Plant actions
  addPlant: (gardenId: string, bedId: string, plant: Omit<Plant, 'id'>) => void;
  updatePlant: (gardenId: string, bedId: string, plant: Plant) => void;
  deletePlant: (gardenId: string, bedId: string, plantId: string) => void;
  
  // Task actions
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string, plantId?: string, bedId?: string) => void;
  
  // Activity actions
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  deleteActivity: (activityId: string) => void;
  
  // Notification actions
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  
  // Helper methods
  getTodaysTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  getTasksForPlant: (plantId: string) => Task[];
  getTasksForGarden: (gardenId: string) => Task[];
}

const GardenContext = createContext<GardenContextType | undefined>(undefined);

// Provider Component
export const GardenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gardenReducer, initialState);

  // Garden actions
  const addGarden = useCallback((garden: Omit<Garden, 'id'>) => {
    dispatch({ type: 'ADD_GARDEN', payload: garden });
  }, []);

  const updateGarden = useCallback((garden: Garden) => {
    dispatch({ type: 'UPDATE_GARDEN', payload: garden });
  }, []);

  const deleteGarden = useCallback((gardenId: string) => {
    dispatch({ type: 'DELETE_GARDEN', payload: gardenId });
  }, []);

  const selectGarden = useCallback((garden: Garden) => {
    dispatch({ type: 'SELECT_GARDEN', payload: garden });
  }, []);

  // Bed actions
  const addBed = useCallback((gardenId: string, bed: Omit<Bed, 'id'>) => {
    dispatch({ type: 'ADD_BED', payload: { gardenId, bed } });
  }, []);

  const updateBed = useCallback((gardenId: string, bed: Bed) => {
    dispatch({ type: 'UPDATE_BED', payload: { gardenId, bed } });
  }, []);

  const deleteBed = useCallback((gardenId: string, bedId: string) => {
    dispatch({ type: 'DELETE_BED', payload: { gardenId, bedId } });
  }, []);

  // Plant actions
  const addPlant = useCallback((gardenId: string, bedId: string, plant: Omit<Plant, 'id'>) => {
    dispatch({ type: 'ADD_PLANT', payload: { gardenId, bedId, plant } });
  }, []);

  const updatePlant = useCallback((gardenId: string, bedId: string, plant: Plant) => {
    dispatch({ type: 'UPDATE_PLANT', payload: { gardenId, bedId, plant } });
  }, []);

  const deletePlant = useCallback((gardenId: string, bedId: string, plantId: string) => {
    dispatch({ type: 'DELETE_PLANT', payload: { gardenId, bedId, plantId } });
  }, []);

  // Task actions
  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    dispatch({ type: 'ADD_TASK', payload: task });
  }, []);

  const updateTask = useCallback((task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  }, []);

  const completeTask = useCallback((taskId: string, plantId?: string, bedId?: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: taskId });
  }, []);

  // Activity actions
  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  }, []);

  const deleteActivity = useCallback((activityId: string) => {
    dispatch({ type: 'DELETE_ACTIVITY', payload: activityId });
  }, []);

  // Notification actions
  const addNotification = useCallback((notification: Notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
  }, []);

  // Helper methods
  const getTodaysTasks = useCallback((): Task[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return state.tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return !task.completed && taskDate >= today && taskDate < tomorrow;
    });
  }, [state.tasks]);

  const getUpcomingTasks = useCallback((): Task[] => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    return state.tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return !task.completed && taskDate > today;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [state.tasks]);

  const getTasksForPlant = useCallback((plantId: string): Task[] => {
    return state.tasks.filter(task => task.plantId === plantId);
  }, [state.tasks]);

  const getTasksForGarden = useCallback((gardenId: string): Task[] => {
    return state.tasks.filter(task => task.gardenId === gardenId);
  }, [state.tasks]);

  const contextValue: GardenContextType = {
    state,
    dispatch,
    generateId,
    addGarden,
    updateGarden,
    deleteGarden,
    selectGarden,
    addBed,
    updateBed,
    deleteBed,
    addPlant,
    updatePlant,
    deletePlant,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    addActivity,
    deleteActivity,
    addNotification,
    markNotificationRead,
    deleteNotification,
    getTodaysTasks,
    getUpcomingTasks,
    getTasksForPlant,
    getTasksForGarden,
  };

  return (
    <GardenContext.Provider value={contextValue}>
      {children}
    </GardenContext.Provider>
  );
};

// Hook to use the context
export const useGarden = (): GardenContextType => {
  const context = useContext(GardenContext);
  if (context === undefined) {
    throw new Error('useGarden must be used within a GardenProvider');
  }
  return context;
};

export default GardenContext;