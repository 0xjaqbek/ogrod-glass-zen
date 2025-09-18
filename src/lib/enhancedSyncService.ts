// src/lib/enhancedSyncService.ts
import { Garden, Task, Notification, Activity, SyncState, VersionedDocument } from '@/types/garden';
import {
  saveGardensToFirebase,
  loadGardensFromFirebase,
  saveTasksToFirebase,
  loadTasksFromFirebase,
  saveNotificationsToFirebase,
  loadNotificationsFromFirebase,
  saveActivitiesToFirebase,
  loadActivitiesFromFirebase,
  initializeUserData,
  subscribeToGardens,
  subscribeToTasks,
  subscribeToNotifications
} from './firebaseService';
import {
  saveAllDataToLocal,
  loadAllDataFromLocal,
  saveSyncTimestamp,
  getSyncTimestamp,
  saveUserIdToLocal,
  getUserIdFromLocal,
  clearUserDataFromLocal,
  hasLocalData,
  saveDocumentVersion,
  getDocumentVersion,
  calculateDocumentChecksum,
  clearAllEnhancedStorage,
  LocalData
} from './localStorageService';
import { conflictResolutionService } from './conflictResolutionService';
import { dataIntegrityService } from './dataIntegrityService';
import { operationQueueService } from './operationQueueService';
import { optimisticUpdateService } from './optimisticUpdateService';
import { toast } from '@/hooks/use-toast';

export interface SyncOptions {
  forceRefresh?: boolean;
  direction?: 'up' | 'down' | 'both';
  skipIntegrityCheck?: boolean;
}

export interface SyncResult {
  success: boolean;
  error?: string;
  syncedData?: LocalData;
  lastSyncTime?: number;
  conflictsDetected?: number;
  operationsProcessed?: number;
}

class EnhancedSyncService {
  private isOnline: boolean = navigator.onLine;
  private isSyncing: boolean = false;
  private syncListeners: ((result: SyncResult) => void)[] = [];
  private stateListeners: ((state: SyncState) => void)[] = [];
  private realtimeUnsubscribers: (() => void)[] = [];
  private currentUserId: string | null = null;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));

    // Set up periodic cleanup
    setInterval(() => this.performMaintenance(), 300000); // Every 5 minutes

    // Set up operation queue processing
    operationQueueService.addProcessingListener((isProcessing) => {
      this.notifyStateListeners();
    });

    // Set up conflict resolution listener
    conflictResolutionService.addConflictListener((conflicts) => {
      this.notifyStateListeners();
    });
  }

  private handleOnline(): void {
    console.log('Device came online - attempting enhanced sync');
    this.isOnline = true;
    this.notifyStateListeners();

    const userId = getUserIdFromLocal();
    if (userId) {
      const pendingOps = operationQueueService.getPendingOperations().length;
      const pendingConflicts = conflictResolutionService.getPendingConflicts().length;

      if (pendingOps > 0 || pendingConflicts > 0) {
        toast({
          title: "Połączenie przywrócone",
          description: `Synchronizowanie ${pendingOps} operacji i ${pendingConflicts} konfliktów...`,
        });
      }

      // Process pending operations and sync
      this.syncData(userId);
    }
  }

  private handleOffline(): void {
    console.log('Device went offline');
    this.isOnline = false;
    this.notifyStateListeners();

    // Unsubscribe from real-time listeners to save resources
    this.unsubscribeFromRealtimeUpdates();
  }

  // Initialize user with enhanced features
  async initializeUser(userId: string): Promise<SyncResult> {
    try {
      this.currentUserId = userId;
      saveUserIdToLocal(userId);
      await initializeUserData(userId);

      // Check and fix data integrity
      const localData = loadAllDataFromLocal();
      const integrity = dataIntegrityService.checkDataIntegrity(localData);

      if (integrity.orphanedTasks.length > 0 ||
          integrity.invalidReferences.length > 0 ||
          integrity.duplicateIds.length > 0) {
        console.log('Fixing data integrity issues...');
        const fixedData = dataIntegrityService.fixDataIntegrity(localData, integrity);
        saveAllDataToLocal(fixedData);
      }

      // Set up real-time sync if online
      if (this.isOnline) {
        this.subscribeToRealtimeUpdates(userId);

        if (hasLocalData()) {
          console.log('Local data found - performing bidirectional sync');
          return await this.syncData(userId, { direction: 'both' });
        } else {
          console.log('No local data - downloading from Firebase');
          return await this.syncData(userId, { direction: 'down' });
        }
      } else {
        console.log('Offline - using local data');
        return {
          success: true,
          syncedData: loadAllDataFromLocal(),
          lastSyncTime: getSyncTimestamp()
        };
      }
    } catch (error) {
      console.error('Error initializing enhanced user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Clear user data with enhanced cleanup
  clearUserData(): void {
    this.currentUserId = null;
    this.unsubscribeFromRealtimeUpdates();
    clearUserDataFromLocal();
    clearAllEnhancedStorage();
    operationQueueService.clearQueue();
    conflictResolutionService.clearConflicts();
    optimisticUpdateService.clear();
  }

  // Enhanced main sync function
  async syncData(userId: string, options: SyncOptions = {}): Promise<SyncResult> {
    if (this.isSyncing) {
      console.log('Enhanced sync already in progress - skipping');
      return { success: false, error: 'Sync already in progress' };
    }

    if (!this.isOnline && options.direction !== 'down') {
      console.log('Device is offline - queueing operations');
      return {
        success: true,
        syncedData: this.getOptimisticData(),
        lastSyncTime: getSyncTimestamp()
      };
    }

    this.isSyncing = true;
    this.notifyStateListeners();

    let conflictsDetected = 0;
    let operationsProcessed = 0;
    let toastId: string | null = null;

    try {
      const { direction = 'both', forceRefresh = false, skipIntegrityCheck = false } = options;

      // Show sync progress toast
      toastId = this.showSyncStartToast(direction);

      // Step 1: Process any pending operations from queue
      if (direction === 'up' || direction === 'both') {
        await operationQueueService.processQueue();
        operationsProcessed = operationQueueService.getPendingOperations().length;
      }

      // Step 2: Perform data integrity check
      if (!skipIntegrityCheck) {
        const localData = loadAllDataFromLocal();
        const integrity = dataIntegrityService.checkDataIntegrity(localData);

        if (integrity.orphanedTasks.length > 0 ||
            integrity.invalidReferences.length > 0 ||
            integrity.duplicateIds.length > 0) {
          const fixedData = dataIntegrityService.fixDataIntegrity(localData, integrity);
          saveAllDataToLocal(fixedData);
        }
      }

      let result: SyncResult;

      // Step 3: Perform incremental sync
      if (direction === 'down' || direction === 'both') {
        result = await this.performIncrementalSync(userId, forceRefresh);
        conflictsDetected = conflictResolutionService.getPendingConflicts().length;
      } else {
        result = {
          success: true,
          syncedData: this.getOptimisticData(),
          lastSyncTime: Date.now()
        };
      }

      // Step 4: Upload local changes
      if ((direction === 'up' || direction === 'both') && result.success) {
        await this.uploadOptimisticChanges(userId);
      }

      // Update sync timestamp
      saveSyncTimestamp(Date.now());

      // Show success toast
      this.showSyncCompleteToast(conflictsDetected, operationsProcessed);

      const finalResult: SyncResult = {
        ...result,
        conflictsDetected,
        operationsProcessed
      };

      this.notifyListeners(finalResult);
      return finalResult;

    } catch (error) {
      console.error('Enhanced sync error:', error);

      this.showSyncErrorToast();

      const result: SyncResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown sync error',
        conflictsDetected,
        operationsProcessed
      };

      this.notifyListeners(result);
      return result;
    } finally {
      this.isSyncing = false;
      this.notifyStateListeners();
    }
  }

  // Perform incremental sync with conflict detection
  private async performIncrementalSync(userId: string, forceRefresh: boolean): Promise<SyncResult> {
    const lastSync = getSyncTimestamp();
    const shouldSync = forceRefresh || Date.now() - lastSync > 60000;

    if (!shouldSync && hasLocalData()) {
      return {
        success: true,
        syncedData: this.getOptimisticData(),
        lastSyncTime: lastSync
      };
    }

    try {
      // Download remote data
      const [remoteGardens, remoteTasks, remoteNotifications, remoteActivities] = await Promise.all([
        loadGardensFromFirebase(userId),
        loadTasksFromFirebase(userId),
        loadNotificationsFromFirebase(userId),
        loadActivitiesFromFirebase(userId)
      ]);

      const remoteData: LocalData = {
        gardens: remoteGardens,
        tasks: remoteTasks,
        notifications: remoteNotifications,
        activities: remoteActivities
      };

      // Get local data
      const localData = loadAllDataFromLocal();

      // Detect and resolve conflicts
      const mergedData = await this.detectAndResolveConflicts(localData, remoteData, userId);

      // Save merged data
      saveAllDataToLocal(mergedData);

      // Update document versions
      this.updateDocumentVersions(mergedData, userId);

      return {
        success: true,
        syncedData: this.getOptimisticData(),
        lastSyncTime: Date.now()
      };

    } catch (error) {
      console.error('Error in incremental sync:', error);

      // Fallback to local data if available
      if (hasLocalData()) {
        return {
          success: true,
          syncedData: this.getOptimisticData(),
          lastSyncTime: lastSync
        };
      }

      throw error;
    }
  }

  // Detect and resolve conflicts between local and remote data
  private async detectAndResolveConflicts(
    localData: LocalData,
    remoteData: LocalData,
    userId: string
  ): Promise<LocalData> {
    const mergedData: LocalData = {
      gardens: [],
      tasks: [],
      notifications: [],
      activities: []
    };

    // Process each collection
    mergedData.gardens = await this.mergeCollection('gardens', localData.gardens, remoteData.gardens, userId);
    mergedData.tasks = await this.mergeCollection('tasks', localData.tasks, remoteData.tasks, userId);
    mergedData.notifications = await this.mergeCollection('notifications', localData.notifications, remoteData.notifications, userId);
    mergedData.activities = await this.mergeCollection('activities', localData.activities, remoteData.activities, userId);

    return mergedData;
  }

  // Merge collection with conflict detection
  private async mergeCollection<T extends { id: string } & VersionedDocument>(
    collection: string,
    localItems: T[],
    remoteItems: T[],
    userId: string
  ): Promise<T[]> {
    const merged: T[] = [];
    const processedIds = new Set<string>();

    // Create maps for efficient lookup
    const localMap = new Map(localItems.map(item => [item.id, item]));
    const remoteMap = new Map(remoteItems.map(item => [item.id, item]));

    // Process items that exist in both local and remote
    for (const [id, localItem] of localMap) {
      const remoteItem = remoteMap.get(id);
      processedIds.add(id);

      if (!remoteItem) {
        // Item exists only locally - keep it
        merged.push(localItem);
        continue;
      }

      // Both versions exist - check for conflicts
      const conflict = conflictResolutionService.detectConflict(
        id,
        collection,
        localItem,
        remoteItem
      );

      if (conflict) {
        // Try auto-merge first
        const autoMerged = conflictResolutionService.autoMergeChanges(
          localItem,
          remoteItem,
          getDocumentVersion(collection, id) as any
        );

        if (autoMerged) {
          merged.push(autoMerged);
          conflictResolutionService.removeConflict(conflict.id);
        } else {
          // Auto-merge failed - keep conflict for manual resolution
          // For now, use the newer version
          if (new Date(remoteItem.lastModified) > new Date(localItem.lastModified)) {
            merged.push(remoteItem);
          } else {
            merged.push(localItem);
          }
        }
      } else {
        // No conflict - use the newer version
        if (new Date(remoteItem.lastModified) > new Date(localItem.lastModified)) {
          merged.push(remoteItem);
        } else {
          merged.push(localItem);
        }
      }
    }

    // Add items that exist only in remote
    for (const [id, remoteItem] of remoteMap) {
      if (!processedIds.has(id)) {
        merged.push(remoteItem);
      }
    }

    return merged;
  }

  // Upload optimistic changes to Firebase
  private async uploadOptimisticChanges(userId: string): Promise<void> {
    const optimisticData = this.getOptimisticData();

    try {
      // Upload all data with version increments
      await Promise.all([
        saveGardensToFirebase(userId, optimisticData.gardens),
        saveTasksToFirebase(userId, optimisticData.tasks),
        saveNotificationsToFirebase(userId, optimisticData.notifications),
        saveActivitiesToFirebase(userId, optimisticData.activities)
      ]);

      // Confirm all optimistic updates
      const pendingUpdates = optimisticUpdateService.getPendingUpdates();
      pendingUpdates.forEach(update => {
        optimisticUpdateService.confirmUpdate(update.id);
      });

      console.log('Successfully uploaded optimistic changes');
    } catch (error) {
      console.error('Failed to upload optimistic changes:', error);

      // Rollback failed updates
      const pendingUpdates = optimisticUpdateService.getPendingUpdates();
      pendingUpdates.forEach(update => {
        optimisticUpdateService.rollbackUpdate(update.id);
      });

      throw error;
    }
  }

  // Get data with optimistic updates applied
  private getOptimisticData(): LocalData {
    const baseData = loadAllDataFromLocal();

    return {
      gardens: optimisticUpdateService.mergeOptimisticUpdates('gardens', baseData.gardens),
      tasks: optimisticUpdateService.mergeOptimisticUpdates('tasks', baseData.tasks),
      notifications: optimisticUpdateService.mergeOptimisticUpdates('notifications', baseData.notifications),
      activities: optimisticUpdateService.mergeOptimisticUpdates('activities', baseData.activities)
    };
  }

  // Update document versions for conflict detection
  private updateDocumentVersions(data: LocalData, userId: string): void {
    const updateVersions = (items: any[], collection: string) => {
      items.forEach(item => {
        if (item.id && item.version && item.lastModified) {
          saveDocumentVersion({
            id: item.id,
            collection,
            version: item.version,
            lastModified: new Date(item.lastModified),
            checksum: calculateDocumentChecksum(item)
          });
        }
      });
    };

    updateVersions(data.gardens, 'gardens');
    updateVersions(data.tasks, 'tasks');
    updateVersions(data.notifications, 'notifications');
    updateVersions(data.activities, 'activities');
  }

  // Subscribe to real-time Firebase updates
  private subscribeToRealtimeUpdates(userId: string): void {
    // Unsubscribe from any existing listeners first
    this.unsubscribeFromRealtimeUpdates();

    console.log('Setting up real-time sync listeners');

    // Subscribe to gardens changes
    const unsubscribeGardens = subscribeToGardens(userId, (gardens) => {
      this.handleRealtimeUpdate('gardens', gardens);
    });

    // Subscribe to tasks changes
    const unsubscribeTasks = subscribeToTasks(userId, (tasks) => {
      this.handleRealtimeUpdate('tasks', tasks);
    });

    // Subscribe to notifications changes
    const unsubscribeNotifications = subscribeToNotifications(userId, (notifications) => {
      this.handleRealtimeUpdate('notifications', notifications);
    });

    this.realtimeUnsubscribers = [unsubscribeGardens, unsubscribeTasks, unsubscribeNotifications];
  }

  // Handle real-time updates from Firebase
  private handleRealtimeUpdate(collection: string, remoteItems: any[]): void {
    if (this.isSyncing) {
      // Skip real-time updates during manual sync to prevent conflicts
      return;
    }

    console.log(`Real-time update received for ${collection}: ${remoteItems.length} items`);

    const localData = loadAllDataFromLocal();
    const localItems = localData[collection as keyof LocalData] as any[];

    // Simple merge strategy for real-time updates
    // In a production app, you might want more sophisticated conflict handling
    const mergedItems = this.mergeRealtimeUpdates(localItems, remoteItems, collection);

    // Update local storage
    const updatedData = {
      ...localData,
      [collection]: mergedItems
    };

    saveAllDataToLocal(updatedData);

    // Notify listeners of the change
    this.notifyListeners({
      success: true,
      syncedData: this.getOptimisticData(),
      lastSyncTime: Date.now()
    });
  }

  // Merge real-time updates with local data
  private mergeRealtimeUpdates(localItems: any[], remoteItems: any[], collection: string): any[] {
    const merged: any[] = [];
    const remoteMap = new Map(remoteItems.map(item => [item.id, item]));
    const processedIds = new Set<string>();

    // Process existing local items
    localItems.forEach(localItem => {
      const remoteItem = remoteMap.get(localItem.id);
      processedIds.add(localItem.id);

      if (!remoteItem) {
        // Item was deleted remotely or doesn't exist on remote yet
        if (!optimisticUpdateService.hasPendingUpdates(collection, localItem.id)) {
          // No pending local changes - item was likely deleted remotely
          return;
        }
      }

      if (remoteItem && remoteItem.lastModified && localItem.lastModified) {
        // Use the newer version
        if (new Date(remoteItem.lastModified) > new Date(localItem.lastModified)) {
          merged.push(remoteItem);
        } else {
          merged.push(localItem);
        }
      } else {
        merged.push(remoteItem || localItem);
      }
    });

    // Add new remote items
    remoteItems.forEach(remoteItem => {
      if (!processedIds.has(remoteItem.id)) {
        merged.push(remoteItem);
      }
    });

    return merged;
  }

  // Unsubscribe from real-time updates
  private unsubscribeFromRealtimeUpdates(): void {
    this.realtimeUnsubscribers.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.warn('Error unsubscribing from real-time updates:', error);
      }
    });
    this.realtimeUnsubscribers = [];
  }

  // Perform periodic maintenance
  private performMaintenance(): void {
    console.log('Performing sync service maintenance...');

    // Clean up old optimistic updates
    optimisticUpdateService.cleanup();

    // Clean up resolved conflicts older than 1 hour
    const allConflicts = conflictResolutionService.getAllConflicts();
    const oldResolvedConflicts = allConflicts.filter(c =>
      c.resolution !== 'pending' &&
      Date.now() - c.timestamp > 3600000 // 1 hour
    );

    oldResolvedConflicts.forEach(conflict => {
      conflictResolutionService.removeConflict(conflict.id);
    });

    // Clear failed operations older than 24 hours
    const stats = operationQueueService.getQueueStats();
    if (stats.failed > 0) {
      console.log(`Found ${stats.failed} failed operations during maintenance`);
    }
  }

  // Save data with optimistic updates
  async saveData(userId: string, data: Partial<LocalData>, options: { priority?: 'low' | 'medium' | 'high' | 'critical' } = {}): Promise<void> {
    // Always save to local storage first
    const currentData = loadAllDataFromLocal();
    const updatedData = { ...currentData, ...data };
    saveAllDataToLocal(updatedData);

    // Apply optimistic updates
    Object.entries(data).forEach(([collection, items]) => {
      if (items && Array.isArray(items)) {
        items.forEach(item => {
          const currentItem = this.findItemInCollection(currentData[collection as keyof LocalData] as any[], item.id);

          optimisticUpdateService.applyOptimisticUpdate(
            currentItem ? 'update' : 'create',
            collection,
            item.id,
            item,
            currentItem
          );
        });
      }
    });

    // Queue operations for sync
    Object.entries(data).forEach(([collection, items]) => {
      if (items && Array.isArray(items)) {
        items.forEach(item => {
          operationQueueService.addOperation({
            type: 'update',
            collection: collection as any,
            documentId: item.id,
            data: item,
            userId,
            priority: options.priority || 'medium'
          });
        });
      }
    });

    // If online, try immediate sync
    if (this.isOnline && !this.isSyncing) {
      try {
        await this.syncData(userId, { direction: 'up' });
      } catch (error) {
        console.warn('Immediate sync failed, operations queued for later:', error);
      }
    } else if (!this.isOnline) {
      toast({
        title: "Offline",
        description: "Zmiany zapisane lokalnie, zostaną zsynchronizowane gdy będzie połączenie",
      });
    }
  }

  // Helper to find item in collection
  private findItemInCollection(collection: any[], itemId: string): any {
    return collection.find(item => item.id === itemId);
  }

  // Toast helpers
  private showSyncStartToast(direction: string): string {
    const messages = {
      both: "Synchronizowanie danych...",
      up: "Wysyłanie zmian do chmury...",
      down: "Pobieranie najnowszych danych..."
    };

    return toast({
      title: "Synchronizacja",
      description: messages[direction as keyof typeof messages] || "Synchronizowanie...",
    }).id;
  }

  private showSyncCompleteToast(conflicts: number, operations: number): void {
    if (conflicts > 0) {
      toast({
        title: "Synchronizacja z konfliktami",
        description: `Wykryto ${conflicts} konfliktów wymagających rozwiązania`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Synchronizacja zakończona",
        description: operations > 0 ?
          `Przetworzone: ${operations} operacji` :
          "Dane zsynchronizowane pomyślnie",
      });
    }
  }

  private showSyncErrorToast(): void {
    toast({
      title: "Błąd synchronizacji",
      description: "Nie udało się zsynchronizować danych",
      variant: "destructive",
    });
  }

  // Public API methods
  async forceSync(userId: string): Promise<SyncResult> {
    return await this.syncData(userId, { forceRefresh: true, direction: 'both' });
  }

  getSyncState(): SyncState {
    const queueStats = operationQueueService.getQueueStats();
    const conflictStats = conflictResolutionService.getPendingConflicts().length;

    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      lastSyncTime: getSyncTimestamp(),
      pendingOperations: queueStats.pending,
      failedOperations: queueStats.failed,
      conflicts: conflictStats
    };
  }

  // Load data with optimistic updates - offline-first approach
  async loadData(userId: string): Promise<LocalData> {
    // Always try to load from local storage first (offline-first)
    const baseData = loadAllDataFromLocal();
    const optimisticData = this.getOptimisticData();

    // If we have any local data (even if empty collections), return it
    // This ensures we always show last known state when offline
    if (baseData.gardens.length > 0 || baseData.tasks.length > 0 ||
        baseData.notifications.length > 0 || baseData.activities.length > 0) {
      console.log('Returning cached data with optimistic updates');

      // Sync in background if online
      if (this.isOnline && !this.isSyncing) {
        this.syncData(userId, { direction: 'down' }).catch(error => {
          console.warn('Background sync failed:', error);
        });
      }

      return optimisticData;
    }

    // If no local data but we're offline, still return optimistic data
    // (might have optimistic creates)
    if (!this.isOnline) {
      console.log('Offline with no cached data - returning optimistic updates only');
      return optimisticData;
    }

    // Only if online and no local data, try to download from server
    if (this.isOnline) {
      try {
        console.log('No local data and online - downloading from server');
        const result = await this.syncData(userId, { direction: 'down' });
        if (result.success && result.syncedData) {
          return result.syncedData;
        }
      } catch (error) {
        console.warn('Failed to download initial data:', error);
      }
    }

    // Final fallback - return optimistic data (might have creates) or empty
    console.log('Returning fallback data');
    return optimisticData.gardens.length > 0 || optimisticData.tasks.length > 0 ||
           optimisticData.notifications.length > 0 || optimisticData.activities.length > 0 ?
           optimisticData : {
      gardens: [],
      tasks: [],
      notifications: [],
      activities: []
    };
  }

  // Event listeners
  addSyncListener(listener: (result: SyncResult) => void): void {
    this.syncListeners.push(listener);
  }

  removeSyncListener(listener: (result: SyncResult) => void): void {
    this.syncListeners = this.syncListeners.filter(l => l !== listener);
  }

  addStateListener(listener: (state: SyncState) => void): void {
    this.stateListeners.push(listener);
  }

  removeStateListener(listener: (state: SyncState) => void): void {
    this.stateListeners = this.stateListeners.filter(l => l !== listener);
  }

  private notifyListeners(result: SyncResult): void {
    this.syncListeners.forEach(listener => listener(result));
  }

  private notifyStateListeners(): void {
    const state = this.getSyncState();
    this.stateListeners.forEach(listener => listener(state));
  }

  // Utility methods
  isDeviceOnline(): boolean {
    return this.isOnline;
  }

  isSyncInProgress(): boolean {
    return this.isSyncing;
  }
}

// Export singleton instance
export const enhancedSyncService = new EnhancedSyncService();
export default enhancedSyncService;