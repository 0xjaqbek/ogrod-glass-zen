// src/lib/localStorageService.ts
import { Garden, Task, Notification, Activity, SyncOperation, ConflictResolution, OptimisticUpdate } from '@/types/garden';

const STORAGE_KEYS = {
  GARDENS: 'ogrod_gardens',
  TASKS: 'ogrod_tasks',
  NOTIFICATIONS: 'ogrod_notifications',
  ACTIVITIES: 'ogrod_activities',
  SYNC_TIMESTAMP: 'ogrod_last_sync',
  PENDING_CHANGES: 'ogrod_pending_changes',
  USER_ID: 'ogrod_user_id',
  SYNC_OPERATIONS: 'ogrod_sync_operations',
  CONFLICTS: 'ogrod_conflicts',
  OPTIMISTIC_UPDATES: 'ogrod_optimistic_updates',
  DOCUMENT_VERSIONS: 'ogrod_document_versions'
};

export interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: 'gardens' | 'tasks' | 'notifications' | 'activities';
  data?: any;
  timestamp: number;
}

// Document version tracking
export interface DocumentVersion {
  id: string;
  collection: string;
  version: number;
  lastModified: Date;
  checksum?: string;
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

// Sync Operations Storage
export const saveSyncOperations = (operations: SyncOperation[]): void => {
  const data = safeJSONStringify(operations);
  localStorage.setItem(STORAGE_KEYS.SYNC_OPERATIONS, data);
};

export const loadSyncOperations = (): SyncOperation[] => {
  const data = localStorage.getItem(STORAGE_KEYS.SYNC_OPERATIONS);
  return safeJSONParse(data, []);
};

export const addSyncOperation = (operation: SyncOperation): void => {
  const operations = loadSyncOperations();
  operations.push(operation);
  saveSyncOperations(operations);
};

export const removeSyncOperation = (operationId: string): void => {
  const operations = loadSyncOperations();
  const filtered = operations.filter(op => op.id !== operationId);
  saveSyncOperations(filtered);
};

export const clearSyncOperations = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SYNC_OPERATIONS);
};

// Conflicts Storage
export const saveConflicts = (conflicts: ConflictResolution[]): void => {
  const data = safeJSONStringify(conflicts);
  localStorage.setItem(STORAGE_KEYS.CONFLICTS, data);
};

export const loadConflicts = (): ConflictResolution[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CONFLICTS);
  return safeJSONParse(data, []);
};

export const addConflict = (conflict: ConflictResolution): void => {
  const conflicts = loadConflicts();
  conflicts.push(conflict);
  saveConflicts(conflicts);
};

export const removeConflict = (conflictId: string): void => {
  const conflicts = loadConflicts();
  const filtered = conflicts.filter(c => c.id !== conflictId);
  saveConflicts(filtered);
};

export const clearConflicts = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CONFLICTS);
};

// Optimistic Updates Storage
export const saveOptimisticUpdates = (updates: OptimisticUpdate[]): void => {
  const data = safeJSONStringify(updates);
  localStorage.setItem(STORAGE_KEYS.OPTIMISTIC_UPDATES, data);
};

export const loadOptimisticUpdates = (): OptimisticUpdate[] => {
  const data = localStorage.getItem(STORAGE_KEYS.OPTIMISTIC_UPDATES);
  return safeJSONParse(data, []);
};

export const addOptimisticUpdate = (update: OptimisticUpdate): void => {
  const updates = loadOptimisticUpdates();
  updates.push(update);
  saveOptimisticUpdates(updates);
};

export const removeOptimisticUpdate = (updateId: string): void => {
  const updates = loadOptimisticUpdates();
  const filtered = updates.filter(u => u.id !== updateId);
  saveOptimisticUpdates(filtered);
};

export const clearOptimisticUpdates = (): void => {
  localStorage.removeItem(STORAGE_KEYS.OPTIMISTIC_UPDATES);
};

// Document Versions Storage
export const saveDocumentVersions = (versions: DocumentVersion[]): void => {
  const data = safeJSONStringify(versions);
  localStorage.setItem(STORAGE_KEYS.DOCUMENT_VERSIONS, data);
};

export const loadDocumentVersions = (): DocumentVersion[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DOCUMENT_VERSIONS);
  const versions = safeJSONParse(data, []);
  // Convert date strings back to Date objects
  return versions.map((v: any) => ({
    ...v,
    lastModified: new Date(v.lastModified)
  }));
};

export const saveDocumentVersion = (version: DocumentVersion): void => {
  const versions = loadDocumentVersions();
  const existingIndex = versions.findIndex(v => v.id === version.id && v.collection === version.collection);

  if (existingIndex >= 0) {
    versions[existingIndex] = version;
  } else {
    versions.push(version);
  }

  saveDocumentVersions(versions);
};

export const getDocumentVersion = (collection: string, documentId: string): DocumentVersion | undefined => {
  const versions = loadDocumentVersions();
  return versions.find(v => v.collection === collection && v.id === documentId);
};

export const clearDocumentVersions = (): void => {
  localStorage.removeItem(STORAGE_KEYS.DOCUMENT_VERSIONS);
};

// Calculate document checksum for change detection
export const calculateDocumentChecksum = (document: any): string => {
  // Simple checksum based on JSON string
  const str = JSON.stringify(document, (key, value) => {
    // Exclude version metadata from checksum
    if (['version', 'lastModified', 'lastModifiedBy', 'createdAt', 'createdBy'].includes(key)) {
      return undefined;
    }
    return value;
  });

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return hash.toString(36);
};

// Clear all enhanced storage
export const clearAllEnhancedStorage = (): void => {
  clearSyncOperations();
  clearConflicts();
  clearOptimisticUpdates();
  clearDocumentVersions();
};