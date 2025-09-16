// src/lib/syncService.ts
import { Garden, Task, Notification, Activity } from '@/types/garden';
import {
  saveGardensToFirebase,
  loadGardensFromFirebase,
  saveTasksToFirebase,
  loadTasksFromFirebase,
  saveNotificationsToFirebase,
  loadNotificationsFromFirebase,
  saveActivitiesToFirebase,
  loadActivitiesFromFirebase,
  initializeUserData
} from './firebaseService';
import {
  saveAllDataToLocal,
  loadAllDataFromLocal,
  saveSyncTimestamp,
  getSyncTimestamp,
  addPendingChange,
  loadPendingChanges,
  removePendingChange,
  clearPendingChanges,
  hasLocalData,
  saveUserIdToLocal,
  getUserIdFromLocal,
  clearUserDataFromLocal,
  LocalData,
  PendingChange
} from './localStorageService';
import { toast } from '@/hooks/use-toast';

export interface SyncOptions {
  forceRefresh?: boolean;
  direction?: 'up' | 'down' | 'both';
}

export interface SyncResult {
  success: boolean;
  error?: string;
  syncedData?: LocalData;
  lastSyncTime?: number;
}

class SyncService {
  private isOnline: boolean = navigator.onLine;
  private isSyncing: boolean = false;
  private syncListeners: ((result: SyncResult) => void)[] = [];

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  private handleOnline(): void {
    console.log('Device came online - attempting sync');
    this.isOnline = true;
    // Automatically sync when coming online
    const userId = getUserIdFromLocal();
    if (userId) {
      const pendingChanges = loadPendingChanges().length;
      if (pendingChanges > 0) {
        toast({
          title: "Połączenie przywrócone",
          description: `Synchronizowanie ${pendingChanges} oczekujących zmian...`,
        });
      }
      this.syncData(userId);
    }
  }

  private handleOffline(): void {
    console.log('Device went offline');
    this.isOnline = false;
  }

  // Add sync listener
  addSyncListener(listener: (result: SyncResult) => void): void {
    this.syncListeners.push(listener);
  }

  // Remove sync listener
  removeSyncListener(listener: (result: SyncResult) => void): void {
    this.syncListeners = this.syncListeners.filter(l => l !== listener);
  }

  // Notify all listeners
  private notifyListeners(result: SyncResult): void {
    this.syncListeners.forEach(listener => listener(result));
  }

  // Check if device is online
  isDeviceOnline(): boolean {
    return this.isOnline;
  }

  // Check if sync is in progress
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  // Initialize user data (called on login)
  async initializeUser(userId: string): Promise<SyncResult> {
    try {
      saveUserIdToLocal(userId);
      await initializeUserData(userId);

      // Check if we have local data
      if (hasLocalData()) {
        console.log('Local data found - syncing with Firebase');
        return await this.syncData(userId, { direction: 'both' });
      } else if (this.isOnline) {
        console.log('No local data found - downloading from Firebase');
        return await this.syncData(userId, { direction: 'down' });
      } else {
        console.log('Offline - using empty local state');
        return {
          success: true,
          syncedData: loadAllDataFromLocal(),
          lastSyncTime: getSyncTimestamp()
        };
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Clear user data (called on logout)
  clearUserData(): void {
    clearUserDataFromLocal();
    clearPendingChanges();
  }

  // Main sync function
  async syncData(userId: string, options: SyncOptions = {}): Promise<SyncResult> {
    if (this.isSyncing) {
      console.log('Sync already in progress - skipping');
      return { success: false, error: 'Sync already in progress' };
    }

    if (!this.isOnline && options.direction !== 'down') {
      console.log('Device is offline - saving changes locally');
      // Just save to local storage when offline
      return {
        success: true,
        syncedData: loadAllDataFromLocal(),
        lastSyncTime: getSyncTimestamp()
      };
    }

    this.isSyncing = true;
    let toastId: string | null = null;

    try {
      const { direction = 'both', forceRefresh = false } = options;
      let result: SyncResult;

      // Show sync start toast
      if (direction === 'both') {
        toastId = toast({
          title: "Synchronizacja",
          description: "Synchronizowanie danych...",
        }).id;
      } else if (direction === 'up') {
        toastId = toast({
          title: "Wysyłanie",
          description: "Wysyłanie zmian do chmury...",
        }).id;
      } else if (direction === 'down') {
        toastId = toast({
          title: "Pobieranie",
          description: "Pobieranie najnowszych danych...",
        }).id;
      }

      if (direction === 'up' || direction === 'both') {
        // Upload local changes to Firebase
        await this.uploadLocalChanges(userId);
      }

      if (direction === 'down' || direction === 'both') {
        // Download data from Firebase
        result = await this.downloadFromFirebase(userId, forceRefresh);
      } else {
        result = {
          success: true,
          syncedData: loadAllDataFromLocal(),
          lastSyncTime: Date.now()
        };
      }

      // Update sync timestamp
      saveSyncTimestamp(Date.now());

      // Show success toast
      if (toastId) {
        toast({
          title: "Synchronizacja zakończona",
          description: "Dane zostały pomyślnie zsynchronizowane",
        });
      }

      this.notifyListeners(result);
      return result;

    } catch (error) {
      console.error('Sync error:', error);

      // Show error toast
      if (toastId) {
        toast({
          title: "Błąd synchronizacji",
          description: "Nie udało się zsynchronizować danych",
          variant: "destructive",
        });
      }

      const result: SyncResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown sync error'
      };
      this.notifyListeners(result);
      return result;
    } finally {
      this.isSyncing = false;
    }
  }

  // Upload local changes to Firebase
  private async uploadLocalChanges(userId: string): Promise<void> {
    console.log('Uploading local changes to Firebase');

    const localData = loadAllDataFromLocal();
    const pendingChanges = loadPendingChanges();

    // If we have pending changes, apply them first
    if (pendingChanges.length > 0) {
      console.log(`Processing ${pendingChanges.length} pending changes`);
      // For now, we'll do a full upload. In a more sophisticated implementation,
      // we could apply individual changes
    }

    // Upload all data to Firebase
    await Promise.all([
      saveGardensToFirebase(userId, localData.gardens),
      saveTasksToFirebase(userId, localData.tasks),
      saveNotificationsToFirebase(userId, localData.notifications),
      saveActivitiesToFirebase(userId, localData.activities)
    ]);

    // Clear pending changes after successful upload
    clearPendingChanges();
    console.log('Successfully uploaded local changes to Firebase');
  }

  // Download data from Firebase
  private async downloadFromFirebase(userId: string, forceRefresh: boolean = false): Promise<SyncResult> {
    console.log('Downloading data from Firebase');

    const lastSync = getSyncTimestamp();
    const shouldSync = forceRefresh || Date.now() - lastSync > 60000; // Sync if more than 1 minute old

    if (!shouldSync && hasLocalData()) {
      console.log('Using cached data - sync not needed');
      return {
        success: true,
        syncedData: loadAllDataFromLocal(),
        lastSyncTime: lastSync
      };
    }

    try {
      // Download all data from Firebase
      const [gardens, tasks, notifications, activities] = await Promise.all([
        loadGardensFromFirebase(userId),
        loadTasksFromFirebase(userId),
        loadNotificationsFromFirebase(userId),
        loadActivitiesFromFirebase(userId)
      ]);

      const syncedData: LocalData = {
        gardens,
        tasks,
        notifications,
        activities
      };

      // Save to local storage
      saveAllDataToLocal(syncedData);

      console.log('Successfully downloaded and cached data from Firebase');
      return {
        success: true,
        syncedData,
        lastSyncTime: Date.now()
      };

    } catch (error) {
      console.error('Error downloading from Firebase:', error);

      // If download fails but we have local data, use that
      if (hasLocalData()) {
        console.log('Using local data as fallback');
        return {
          success: true,
          syncedData: loadAllDataFromLocal(),
          lastSyncTime: lastSync
        };
      }

      throw error;
    }
  }

  // Load data with offline-first approach
  async loadData(userId: string): Promise<LocalData> {
    // Always load from local storage first
    const localData = loadAllDataFromLocal();

    // If we have local data, return it immediately
    if (hasLocalData()) {
      // Sync in background if online
      if (this.isOnline) {
        this.syncData(userId, { direction: 'down' }).catch(error => {
          console.warn('Background sync failed:', error);
        });
      }
      return localData;
    }

    // If no local data and online, try to download
    if (this.isOnline) {
      const result = await this.syncData(userId, { direction: 'down' });
      if (result.success && result.syncedData) {
        return result.syncedData;
      }
    }

    // Return empty data as fallback
    return {
      gardens: [],
      tasks: [],
      notifications: [],
      activities: []
    };
  }

  // Save data with offline support
  async saveData(userId: string, data: Partial<LocalData>): Promise<void> {
    // Always save to local storage first
    const currentData = loadAllDataFromLocal();
    const updatedData = { ...currentData, ...data };
    saveAllDataToLocal(updatedData);

    // If offline, add to pending changes and show notification
    if (!this.isOnline) {
      Object.entries(data).forEach(([collection, items]) => {
        if (items && items.length > 0) {
          addPendingChange({
            type: 'update',
            collection: collection as keyof LocalData,
            data: items
          });
        }
      });

      toast({
        title: "Offline",
        description: "Zmiany zapisane lokalnie, zostaną zsynchronizowane gdy będzie połączenie",
      });
      return;
    }

    // If online, try to sync immediately
    try {
      await this.syncData(userId, { direction: 'up' });
    } catch (error) {
      console.warn('Immediate sync failed, will retry later:', error);
      // Add to pending changes for later sync
      Object.entries(data).forEach(([collection, items]) => {
        if (items && items.length > 0) {
          addPendingChange({
            type: 'update',
            collection: collection as keyof LocalData,
            data: items
          });
        }
      });

      toast({
        title: "Połączenie przerwane",
        description: "Zmiany zapisane lokalnie, zostaną zsynchronizowane później",
      });
    }
  }

  // Force sync - useful for manual refresh
  async forcSync(userId: string): Promise<SyncResult> {
    return await this.syncData(userId, { forceRefresh: true, direction: 'both' });
  }

  // Get sync status
  getSyncStatus(): { isOnline: boolean; isSyncing: boolean; lastSync: number; pendingChanges: number } {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      lastSync: getSyncTimestamp(),
      pendingChanges: loadPendingChanges().length
    };
  }
}

// Export singleton instance
export const syncService = new SyncService();
export default syncService;