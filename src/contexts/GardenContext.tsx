import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { enhancedSyncService } from '@/lib/enhancedSyncService';
import { optimisticUpdateService } from '@/lib/optimisticUpdateService';
import { VersionedDocument } from '@/types/garden';

// Types with versioning support
export interface Plant extends VersionedDocument {
  id: string;
  name: string;
  emoji: string;
  phase: 'planted' | 'growing' | 'flowering' | 'fruiting' | 'mature';
  progress: number;
  plantedDate: Date;
  lastWatered?: Date;
  lastFertilized?: Date;
  variety?: string;
  notes?: string;
}

export interface Bed extends VersionedDocument {
  id: string;
  name: string;
  plants: Plant[];
  size?: string;
  soilType?: string;
  location?: string;
}

export interface Garden extends VersionedDocument {
  id: string;
  name: string;
  beds: Bed[];
  location?: string;
  description?: string;
}

export interface Task extends VersionedDocument {
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

export interface Activity extends VersionedDocument {
  id: string;
  action: string;
  date: Date;
  gardenId: string;
  bedId?: string;
  plantId?: string;
}

export interface Notification extends VersionedDocument {
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
  | { type: 'LOAD_DATA'; payload: { gardens: Garden[]; tasks: Task[]; notifications: Notification[]; activities: Activity[] } }
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
    case 'LOAD_DATA':
      console.log('Loading data from Firebase:', {
        gardens: action.payload.gardens.length,
        tasks: action.payload.tasks.length,
        notifications: action.payload.notifications.length,
        activities: action.payload.activities.length
      });

      // Debug tasks that might have invalid dates
      action.payload.tasks.forEach(task => {
        if (!task.dueDate || task.dueDate === 'Invalid Date') {
          console.warn('Task with invalid/missing dueDate:', task);
        }
      });

      return {
        ...state,
        gardens: action.payload.gardens,
        tasks: action.payload.tasks,
        notifications: action.payload.notifications,
        activities: action.payload.activities,
      };

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
      const completedTasks = state.tasks.map(task => {
        if (task.id === action.payload) {
          const completedTask = { ...task, completed: true };
          console.log('Completing task:', task.title, 'Original dueDate:', task.dueDate, 'Completed task dueDate:', completedTask.dueDate);
          return completedTask;
        }
        return task;
      });

      return {
        ...state,
        tasks: completedTasks,
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

// Helper function to add versioning metadata
const addVersioningMetadata = (item: any, userId: string): any => {
  const now = new Date();
  return {
    ...item,
    version: (item.version || 0) + 1,
    lastModified: now,
    lastModifiedBy: userId,
    createdAt: item.createdAt || now,
    createdBy: item.createdBy || userId
  };
};

// Helper function to prepare item for optimistic update
const prepareForOptimisticUpdate = (item: any, userId: string): any => {
  return addVersioningMetadata(item, userId);
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
  const [isInitialized, setIsInitialized] = React.useState(false);
  const { currentUser } = useAuth();

  // Initialize user data and load from sync service when user changes
  useEffect(() => {
    if (!currentUser) {
      // Clear data when user logs out
      enhancedSyncService.clearUserData();
      dispatch({ type: 'LOAD_DATA', payload: { gardens: [], tasks: [], notifications: [], activities: [] } });
      setIsInitialized(false);
      return;
    }

    // Prevent re-initialization for the same user
    if (isInitialized) {
      console.log('User already initialized, skipping...');
      return;
    }

    const initializeAndLoadData = async () => {
      try {
        console.log('Initializing user and loading data with sync service');
        setIsInitialized(true);

        // Initialize user with enhanced sync service (handles offline-first loading)
        const syncResult = await enhancedSyncService.initializeUser(currentUser.uid);

        if (syncResult.success && syncResult.syncedData) {
          // Update state with loaded data (from local storage or Firebase)
          dispatch({
            type: 'LOAD_DATA',
            payload: syncResult.syncedData
          });
        } else {
          console.error('Failed to initialize user data:', syncResult.error);
          setIsInitialized(false); // Reset on failure
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setIsInitialized(false); // Reset on error
      }
    };

    initializeAndLoadData();
  }, [currentUser, isInitialized]);

  // Auto-save to sync service when data changes (offline-first)
  useEffect(() => {
    if (!currentUser || !isInitialized) return;

    const saveDataToSync = async () => {
      try {
        // Don't save if we haven't loaded data yet (prevents clearing database on app start)
        const hasLoadedData = state.gardens.length > 0 || state.tasks.length > 0 ||
                             state.notifications.length > 0 || state.activities.length > 0;

        if (!hasLoadedData) {
          console.log('Skipping save - no data loaded yet');
          return;
        }

        // Skip saving if sync is in progress to prevent loops
        if (enhancedSyncService.isSyncInProgress()) {
          console.log('Skipping save - sync in progress');
          return;
        }

        console.log('Saving data with sync service:', {
          gardens: state.gardens.length,
          tasks: state.tasks.length,
          notifications: state.notifications.length,
          activities: state.activities.length,
          userId: currentUser.uid
        });

        // Save to enhanced sync service (handles offline/online automatically with optimistic updates)
        await enhancedSyncService.saveData(currentUser.uid, {
          gardens: state.gardens,
          tasks: state.tasks,
          notifications: state.notifications,
          activities: state.activities
        }, { priority: 'medium' });

        console.log('Successfully saved all data via sync service');
      } catch (error) {
        console.error('Error saving data via sync service:', error);
      }
    };

    // Debounce saves to avoid too many writes, longer debounce in development
    const debounceTime = process.env.NODE_ENV === 'development' ? 3000 : 1000;
    const timeoutId = setTimeout(saveDataToSync, debounceTime);
    return () => clearTimeout(timeoutId);
  }, [currentUser, isInitialized, state.gardens, state.tasks, state.notifications, state.activities]);

  // Garden actions with optimistic updates
  const addGarden = useCallback((garden: Omit<Garden, 'id'>) => {
    const newGarden = {
      ...garden,
      id: generateId()
    };

    if (currentUser) {
      const versionedGarden = prepareForOptimisticUpdate(newGarden, currentUser.uid);
      dispatch({ type: 'ADD_GARDEN', payload: versionedGarden });

      // Create activity for garden creation
      const activity = {
        id: generateId(),
        action: `Utworzono ogród "${versionedGarden.name}"`,
        date: new Date(),
        gardenId: versionedGarden.id,
        version: 1,
        lastModified: new Date(),
        lastModifiedBy: currentUser.uid,
        createdAt: new Date(),
        createdBy: currentUser.uid
      };
      dispatch({ type: 'ADD_ACTIVITY', payload: activity });

      // Apply optimistic update
      optimisticUpdateService.applyOptimisticUpdate(
        'create',
        'gardens',
        versionedGarden.id,
        versionedGarden
      );
    } else {
      dispatch({ type: 'ADD_GARDEN', payload: newGarden });
    }
  }, [currentUser]);

  const updateGarden = useCallback((garden: Garden) => {
    if (currentUser) {
      const versionedGarden = prepareForOptimisticUpdate(garden, currentUser.uid);
      const currentGarden = state.gardens.find(g => g.id === garden.id);

      dispatch({ type: 'UPDATE_GARDEN', payload: versionedGarden });

      // Apply optimistic update
      optimisticUpdateService.applyOptimisticUpdate(
        'update',
        'gardens',
        versionedGarden.id,
        versionedGarden,
        currentGarden
      );
    } else {
      dispatch({ type: 'UPDATE_GARDEN', payload: garden });
    }
  }, [currentUser, state.gardens]);

  const deleteGarden = useCallback((gardenId: string) => {
    if (currentUser) {
      const currentGarden = state.gardens.find(g => g.id === gardenId);

      dispatch({ type: 'DELETE_GARDEN', payload: gardenId });

      // Apply optimistic update
      if (currentGarden) {
        optimisticUpdateService.applyOptimisticUpdate(
          'delete',
          'gardens',
          gardenId,
          null,
          currentGarden
        );
      }
    } else {
      dispatch({ type: 'DELETE_GARDEN', payload: gardenId });
    }
  }, [currentUser, state.gardens]);

  const selectGarden = useCallback((garden: Garden) => {
    dispatch({ type: 'SELECT_GARDEN', payload: garden });
  }, []);

  // Bed actions with activity tracking
  const addBed = useCallback((gardenId: string, bed: Omit<Bed, 'id'>) => {
    const newBed = {
      ...bed,
      id: generateId()
    };

    if (currentUser) {
      const versionedBed = prepareForOptimisticUpdate(newBed, currentUser.uid);
      dispatch({ type: 'ADD_BED', payload: { gardenId, bed: versionedBed } });

      // Create activity for bed creation
      const garden = state.gardens.find(g => g.id === gardenId);
      const activity = {
        id: generateId(),
        action: `Utworzono grządkę "${versionedBed.name}"${garden ? ` w ogrodzie "${garden.name}"` : ''}`,
        date: new Date(),
        gardenId,
        bedId: versionedBed.id,
        version: 1,
        lastModified: new Date(),
        lastModifiedBy: currentUser.uid,
        createdAt: new Date(),
        createdBy: currentUser.uid
      };
      dispatch({ type: 'ADD_ACTIVITY', payload: activity });

      // Apply optimistic update for bed
      optimisticUpdateService.applyOptimisticUpdate(
        'update',
        'gardens',
        gardenId,
        { beds: [...(garden?.beds || []), versionedBed] },
        garden
      );
    } else {
      dispatch({ type: 'ADD_BED', payload: { gardenId, bed: newBed } });
    }
  }, [currentUser, state.gardens]);

  const updateBed = useCallback((gardenId: string, bed: Bed) => {
    dispatch({ type: 'UPDATE_BED', payload: { gardenId, bed } });
  }, []);

  const deleteBed = useCallback((gardenId: string, bedId: string) => {
    dispatch({ type: 'DELETE_BED', payload: { gardenId, bedId } });
  }, []);

  // Plant actions with activity tracking
  const addPlant = useCallback((gardenId: string, bedId: string, plant: Omit<Plant, 'id'>) => {
    const newPlant = {
      ...plant,
      id: generateId()
    };

    if (currentUser) {
      const versionedPlant = prepareForOptimisticUpdate(newPlant, currentUser.uid);
      dispatch({ type: 'ADD_PLANT', payload: { gardenId, bedId, plant: versionedPlant } });

      // Create activity for plant creation
      const garden = state.gardens.find(g => g.id === gardenId);
      const bed = garden?.beds.find(b => b.id === bedId);
      const activity = {
        id: generateId(),
        action: `Posadzono ${versionedPlant.name} ${versionedPlant.emoji}${bed ? ` na grządce "${bed.name}"` : ''}${garden ? ` w ogrodzie "${garden.name}"` : ''}`,
        date: new Date(),
        gardenId,
        bedId,
        plantId: versionedPlant.id,
        version: 1,
        lastModified: new Date(),
        lastModifiedBy: currentUser.uid,
        createdAt: new Date(),
        createdBy: currentUser.uid
      };
      dispatch({ type: 'ADD_ACTIVITY', payload: activity });

      // Apply optimistic update for plant
      optimisticUpdateService.applyOptimisticUpdate(
        'update',
        'gardens',
        gardenId,
        garden,
        garden
      );
    } else {
      dispatch({ type: 'ADD_PLANT', payload: { gardenId, bedId, plant: newPlant } });
    }
  }, [currentUser, state.gardens]);

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
    const task = state.tasks.find(t => t.id === taskId);
    dispatch({ type: 'COMPLETE_TASK', payload: taskId });

    // Create activity for task completion
    if (task && currentUser) {
      const garden = state.gardens.find(g => g.id === task.gardenId);
      const bed = garden?.beds.find(b => b.id === task.bedId);
      const plant = bed?.plants.find(p => p.id === task.plantId);

      let activityText = `Ukończono zadanie: ${task.title}`;
      if (plant) {
        activityText += ` dla rośliny ${plant.name} ${plant.emoji}`;
      }
      if (bed) {
        activityText += ` na grządce "${bed.name}"`;
      }
      if (garden) {
        activityText += ` w ogrodzie "${garden.name}"`;
      }

      const activity = {
        id: generateId(),
        action: activityText,
        date: new Date(),
        gardenId: task.gardenId,
        bedId: task.bedId,
        plantId: task.plantId,
        version: 1,
        lastModified: new Date(),
        lastModifiedBy: currentUser.uid,
        createdAt: new Date(),
        createdBy: currentUser.uid
      };
      dispatch({ type: 'ADD_ACTIVITY', payload: activity });
    }
  }, [state.tasks, state.gardens, currentUser]);

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
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    console.log('getTodaysTasks: checking for today:', today.toDateString());
    console.log('getTodaysTasks: current date/time:', now);

    return state.tasks.filter(task => {
      if (!task.dueDate || task.completed) {
        return false;
      }

      // Ensure we have a proper Date object
      const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);

      // Check if task date is valid
      if (isNaN(taskDate.getTime())) {
        console.log(`getTodaysTasks: Invalid date for task ${task.title}:`, task.dueDate);
        return false;
      }

      // Compare only the date part (ignore time)
      const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
      const isToday = taskDateOnly.getTime() === today.getTime();

      console.log(`getTodaysTasks: ${task.title}`, {
        taskDueDate: task.dueDate,
        taskDateOnly: taskDateOnly.toDateString(),
        today: today.toDateString(),
        isToday: isToday,
        taskDateMillis: taskDateOnly.getTime(),
        todayMillis: today.getTime()
      });

      return isToday;
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