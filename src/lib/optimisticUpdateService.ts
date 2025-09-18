// src/lib/optimisticUpdateService.ts
import { OptimisticUpdate } from '@/types/garden';
import { toast } from '@/hooks/use-toast';

class OptimisticUpdateService {
  private updates: Map<string, OptimisticUpdate> = new Map();
  private rollbackListeners: ((update: OptimisticUpdate) => void)[] = [];

  // Apply optimistic update
  applyOptimisticUpdate(
    type: 'create' | 'update' | 'delete',
    collection: string,
    documentId: string,
    optimisticData: any,
    originalData?: any
  ): string {
    const updateId = this.generateUpdateId();

    const update: OptimisticUpdate = {
      id: updateId,
      type,
      collection,
      documentId,
      originalData,
      optimisticData,
      timestamp: Date.now(),
      applied: true
    };

    this.updates.set(updateId, update);

    console.log(`Applied optimistic update: ${type} ${collection}/${documentId}`);

    // Auto-cleanup after 30 seconds if not confirmed or rolled back
    setTimeout(() => {
      if (this.updates.has(updateId)) {
        console.warn(`Optimistic update ${updateId} not confirmed within 30 seconds, rolling back`);
        this.rollbackUpdate(updateId);
      }
    }, 30000);

    return updateId;
  }

  // Confirm optimistic update (remove from pending)
  confirmUpdate(updateId: string): boolean {
    const update = this.updates.get(updateId);
    if (!update) {
      console.warn(`Cannot confirm update ${updateId} - not found`);
      return false;
    }

    this.updates.delete(updateId);
    console.log(`Confirmed optimistic update: ${update.type} ${update.collection}/${update.documentId}`);

    return true;
  }

  // Rollback optimistic update
  rollbackUpdate(updateId: string): boolean {
    const update = this.updates.get(updateId);
    if (!update) {
      console.warn(`Cannot rollback update ${updateId} - not found`);
      return false;
    }

    // Mark as rolled back
    const rolledBackUpdate = {
      ...update,
      applied: false
    };
    this.updates.set(updateId, rolledBackUpdate);

    // Notify listeners to revert the UI changes
    this.notifyRollbackListeners(rolledBackUpdate);

    // Remove from map after notification
    setTimeout(() => {
      this.updates.delete(updateId);
    }, 100);

    console.log(`Rolled back optimistic update: ${update.type} ${update.collection}/${update.documentId}`);

    toast({
      title: "Operacja anulowana",
      description: "Zmiany zostały cofnięte z powodu błędu synchronizacji.",
      variant: "destructive"
    });

    return true;
  }

  // Rollback all updates for a specific document
  rollbackDocumentUpdates(collection: string, documentId: string): number {
    const documentUpdates = Array.from(this.updates.values()).filter(
      update => update.collection === collection && update.documentId === documentId && update.applied
    );

    let rolledBack = 0;
    documentUpdates.forEach(update => {
      if (this.rollbackUpdate(update.id)) {
        rolledBack++;
      }
    });

    if (rolledBack > 0) {
      console.log(`Rolled back ${rolledBack} optimistic updates for ${collection}/${documentId}`);
    }

    return rolledBack;
  }

  // Rollback all pending updates
  rollbackAllUpdates(): number {
    const pendingUpdates = Array.from(this.updates.values()).filter(update => update.applied);

    let rolledBack = 0;
    pendingUpdates.forEach(update => {
      if (this.rollbackUpdate(update.id)) {
        rolledBack++;
      }
    });

    if (rolledBack > 0) {
      toast({
        title: "Wszystkie operacje anulowane",
        description: `Cofnięto ${rolledBack} oczekujących zmian.`,
        variant: "destructive"
      });
    }

    return rolledBack;
  }

  // Get all pending updates
  getPendingUpdates(): OptimisticUpdate[] {
    return Array.from(this.updates.values()).filter(update => update.applied);
  }

  // Get updates for a specific document
  getDocumentUpdates(collection: string, documentId: string): OptimisticUpdate[] {
    return Array.from(this.updates.values()).filter(
      update => update.collection === collection && update.documentId === documentId
    );
  }

  // Check if document has pending updates
  hasPendingUpdates(collection: string, documentId: string): boolean {
    return this.getDocumentUpdates(collection, documentId).some(update => update.applied);
  }

  // Get optimistically updated data for a document
  getOptimisticData(collection: string, documentId: string, baseData: any): any {
    const updates = this.getDocumentUpdates(collection, documentId).filter(update => update.applied);

    if (updates.length === 0) {
      return baseData;
    }

    // Apply updates in chronological order
    updates.sort((a, b) => a.timestamp - b.timestamp);

    let result = baseData;

    updates.forEach(update => {
      switch (update.type) {
        case 'create':
          // For create operations, the optimistic data is the new document
          result = update.optimisticData;
          break;

        case 'update':
          // For update operations, merge the changes
          result = {
            ...result,
            ...update.optimisticData,
            // Preserve version info for conflict detection
            version: (result.version || 0) + 1,
            lastModified: new Date()
          };
          break;

        case 'delete':
          // For delete operations, return null/undefined
          result = null;
          break;
      }
    });

    return result;
  }

  // Merge optimistic updates into a collection
  mergeOptimisticUpdates<T extends { id: string }>(
    collection: string,
    baseData: T[]
  ): T[] {
    const result: T[] = [];
    const processedIds = new Set<string>();

    // First, process existing documents with their optimistic updates
    baseData.forEach(item => {
      const optimisticData = this.getOptimisticData(collection, item.id, item);

      if (optimisticData !== null && optimisticData !== undefined) {
        result.push(optimisticData);
      }
      // If optimisticData is null, the item was optimistically deleted

      processedIds.add(item.id);
    });

    // Then, add optimistically created documents
    const pendingUpdates = this.getPendingUpdates().filter(update =>
      update.collection === collection && update.type === 'create' && !processedIds.has(update.documentId)
    );

    pendingUpdates.forEach(update => {
      result.push(update.optimisticData);
    });

    return result;
  }

  // Clean up old updates
  cleanup(maxAge: number = 300000): number { // Default 5 minutes
    const now = Date.now();
    const oldUpdates = Array.from(this.updates.values()).filter(
      update => now - update.timestamp > maxAge
    );

    oldUpdates.forEach(update => {
      this.updates.delete(update.id);
    });

    if (oldUpdates.length > 0) {
      console.log(`Cleaned up ${oldUpdates.length} old optimistic updates`);
    }

    return oldUpdates.length;
  }

  // Generate unique update ID
  private generateUpdateId(): string {
    return `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add rollback listener
  addRollbackListener(listener: (update: OptimisticUpdate) => void): void {
    this.rollbackListeners.push(listener);
  }

  // Remove rollback listener
  removeRollbackListener(listener: (update: OptimisticUpdate) => void): void {
    this.rollbackListeners = this.rollbackListeners.filter(l => l !== listener);
  }

  // Notify rollback listeners
  private notifyRollbackListeners(update: OptimisticUpdate): void {
    this.rollbackListeners.forEach(listener => {
      try {
        listener(update);
      } catch (error) {
        console.error('Error in rollback listener:', error);
      }
    });
  }

  // Get statistics
  getStats(): {
    totalPending: number;
    byCollection: Record<string, number>;
    byType: Record<string, number>;
    oldestPending: number | null;
  } {
    const pending = this.getPendingUpdates();

    const byCollection: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let oldestPending: number | null = null;

    pending.forEach(update => {
      byCollection[update.collection] = (byCollection[update.collection] || 0) + 1;
      byType[update.type] = (byType[update.type] || 0) + 1;

      if (oldestPending === null || update.timestamp < oldestPending) {
        oldestPending = update.timestamp;
      }
    });

    return {
      totalPending: pending.length,
      byCollection,
      byType,
      oldestPending
    };
  }

  // Clear all updates (for testing/reset)
  clear(): void {
    this.updates.clear();
  }
}

// Export singleton instance
export const optimisticUpdateService = new OptimisticUpdateService();
export default optimisticUpdateService;