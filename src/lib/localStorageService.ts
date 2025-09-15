// src/lib/localStorageService.ts
import { Garden, Task, Notification, Activity } from '@/types/garden';

const STORAGE_KEYS = {
  GARDENS: 'ogrod_gardens',
  TASKS: 'ogrod_tasks',
  NOTIFICATIONS: 'ogrod_notifications',
  ACTIVITIES: 'ogrod_activities',
  SYNC_TIMESTAMP: 'ogrod_last_sync',
  PENDING_CHANGES: 'ogrod_pending_changes',
  USER_ID: 'ogrod_user_id'
};

export interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: 'gardens' | 'tasks' | 'notifications' | 'activities';
  data?: any;
  timestamp: number;
}

export interface LocalData {
  gardens: Garden[];
  tasks: Task[];
  notifications: Notification[];
  activities: Activity[];
}

// Helper function to safely parse JSON
const safeJSONParse = <T>(data: string | null, fallback: T): T => {
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (error) {
    console.warn('Failed to parse JSON from localStorage:', error);
    return fallback;
  }
};

// Helper function to safely stringify JSON
const safeJSONStringify = (data: any): string => {
  try {
    return JSON.stringify(data, (key, value) => {
      // Convert Date objects to ISO strings for storage
      if (value instanceof Date) {
        return value.toISOString();
      }
      return value;
    });
  } catch (error) {
    console.error('Failed to stringify data for localStorage:', error);
    return '{}';
  }
};

// Helper function to revive Date objects from stored JSON
const reviveDates = (key: string, value: any): any => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

// Save user ID to localStorage
export const saveUserIdToLocal = (userId: string): void => {
  localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
};

// Get user ID from localStorage
export const getUserIdFromLocal = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.USER_ID);
};

// Clear user data from localStorage
export const clearUserDataFromLocal = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Save gardens to localStorage
export const saveGardensToLocal = (gardens: Garden[]): void => {
  const data = safeJSONStringify(gardens);
  localStorage.setItem(STORAGE_KEYS.GARDENS, data);
};

// Load gardens from localStorage
export const loadGardensFromLocal = (): Garden[] => {
  const data = localStorage.getItem(STORAGE_KEYS.GARDENS);
  if (!data) return [];

  try {
    return JSON.parse(data, reviveDates);
  } catch (error) {
    console.warn('Failed to parse gardens from localStorage:', error);
    return [];
  }
};

// Save tasks to localStorage
export const saveTasksToLocal = (tasks: Task[]): void => {
  const data = safeJSONStringify(tasks);
  localStorage.setItem(STORAGE_KEYS.TASKS, data);
};

// Load tasks from localStorage
export const loadTasksFromLocal = (): Task[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!data) return [];

  try {
    return JSON.parse(data, reviveDates);
  } catch (error) {
    console.warn('Failed to parse tasks from localStorage:', error);
    return [];
  }
};

// Save notifications to localStorage
export const saveNotificationsToLocal = (notifications: Notification[]): void => {
  const data = safeJSONStringify(notifications);
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, data);
};

// Load notifications from localStorage
export const loadNotificationsFromLocal = (): Notification[] => {
  const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
  if (!data) return [];

  try {
    return JSON.parse(data, reviveDates);
  } catch (error) {
    console.warn('Failed to parse notifications from localStorage:', error);
    return [];
  }
};

// Save activities to localStorage
export const saveActivitiesToLocal = (activities: Activity[]): void => {
  const data = safeJSONStringify(activities);
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, data);
};

// Load activities from localStorage
export const loadActivitiesFromLocal = (): Activity[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  if (!data) return [];

  try {
    return JSON.parse(data, reviveDates);
  } catch (error) {
    console.warn('Failed to parse activities from localStorage:', error);
    return [];
  }
};

// Save all data to localStorage
export const saveAllDataToLocal = (data: LocalData): void => {
  saveGardensToLocal(data.gardens);
  saveTasksToLocal(data.tasks);
  saveNotificationsToLocal(data.notifications);
  saveActivitiesToLocal(data.activities);
};

// Load all data from localStorage
export const loadAllDataFromLocal = (): LocalData => {
  return {
    gardens: loadGardensFromLocal(),
    tasks: loadTasksFromLocal(),
    notifications: loadNotificationsFromLocal(),
    activities: loadActivitiesFromLocal()
  };
};

// Save sync timestamp
export const saveSyncTimestamp = (timestamp: number): void => {
  localStorage.setItem(STORAGE_KEYS.SYNC_TIMESTAMP, timestamp.toString());
};

// Get sync timestamp
export const getSyncTimestamp = (): number => {
  const timestamp = localStorage.getItem(STORAGE_KEYS.SYNC_TIMESTAMP);
  return timestamp ? parseInt(timestamp, 10) : 0;
};

// Save pending changes
export const savePendingChanges = (changes: PendingChange[]): void => {
  const data = safeJSONStringify(changes);
  localStorage.setItem(STORAGE_KEYS.PENDING_CHANGES, data);
};

// Load pending changes
export const loadPendingChanges = (): PendingChange[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PENDING_CHANGES);
  return safeJSONParse(data, []);
};

// Add pending change
export const addPendingChange = (change: Omit<PendingChange, 'id' | 'timestamp'>): void => {
  const changes = loadPendingChanges();
  const newChange: PendingChange = {
    ...change,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2),
    timestamp: Date.now()
  };
  changes.push(newChange);
  savePendingChanges(changes);
};

// Remove pending change
export const removePendingChange = (changeId: string): void => {
  const changes = loadPendingChanges();
  const filteredChanges = changes.filter(change => change.id !== changeId);
  savePendingChanges(filteredChanges);
};

// Clear pending changes
export const clearPendingChanges = (): void => {
  localStorage.removeItem(STORAGE_KEYS.PENDING_CHANGES);
};

// Check if we have local data
export const hasLocalData = (): boolean => {
  const data = loadAllDataFromLocal();
  return data.gardens.length > 0 || data.tasks.length > 0 ||
         data.notifications.length > 0 || data.activities.length > 0;
};