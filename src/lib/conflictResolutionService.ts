// src/lib/conflictResolutionService.ts
import { ConflictResolution, VersionedDocument } from '@/types/garden';
import { toast } from '@/hooks/use-toast';

class ConflictResolutionService {
  private conflicts: Map<string, ConflictResolution> = new Map();
  private conflictListeners: ((conflicts: ConflictResolution[]) => void)[] = [];

  // Detect conflicts between local and remote versions
  detectConflict(
    documentId: string,
    collection: string,
    localVersion: any & VersionedDocument,
    remoteVersion: any & VersionedDocument
  ): ConflictResolution | null {
    // If versions match, no conflict
    if (localVersion.version === remoteVersion.version) {
      return null;
    }

    // If one version is clearly newer (by timestamp), use that
    const timeDiff = new Date(remoteVersion.lastModified).getTime() - new Date(localVersion.lastModified).getTime();
    if (Math.abs(timeDiff) > 60000) { // More than 1 minute difference
      // Auto-resolve to newer version if changes don't overlap
      const conflictFields = this.findConflictingFields(localVersion, remoteVersion);
      if (conflictFields.length === 0) {
        return null; // No actual conflicts
      }
    }

    // Create conflict resolution object
    const conflict: ConflictResolution = {
      id: `${collection}_${documentId}_${Date.now()}`,
      documentId,
      collection,
      localVersion,
      remoteVersion,
      conflictFields: this.findConflictingFields(localVersion, remoteVersion),
      resolution: 'pending',
      timestamp: Date.now()
    };

    this.conflicts.set(conflict.id, conflict);
    this.notifyConflictListeners();

    toast({
      title: "Konflikt danych",
      description: `Wykryto konflikt w ${this.getCollectionDisplayName(collection)}. Wymagane jest rozwiązanie.`,
      variant: "destructive"
    });

    return conflict;
  }

  // Find fields that conflict between versions
  private findConflictingFields(local: any, remote: any): string[] {
    const conflicts: string[] = [];
    const allKeys = new Set([...Object.keys(local), ...Object.keys(remote)]);

    for (const key of allKeys) {
      if (key === 'version' || key === 'lastModified' || key === 'lastModifiedBy') {
        continue; // Skip metadata fields
      }

      const localValue = local[key];
      const remoteValue = remote[key];

      if (this.valuesConflict(localValue, remoteValue)) {
        conflicts.push(key);
      }
    }

    return conflicts;
  }

  // Check if two values conflict
  private valuesConflict(local: any, remote: any): boolean {
    // Both null/undefined - no conflict
    if (local == null && remote == null) return false;

    // One is null/undefined, other isn't - conflict
    if (local == null || remote == null) return true;

    // Handle arrays
    if (Array.isArray(local) && Array.isArray(remote)) {
      return JSON.stringify(local.sort()) !== JSON.stringify(remote.sort());
    }

    // Handle objects (excluding dates)
    if (typeof local === 'object' && typeof remote === 'object' &&
        !(local instanceof Date) && !(remote instanceof Date)) {
      return JSON.stringify(local) !== JSON.stringify(remote);
    }

    // Handle dates
    if (local instanceof Date && remote instanceof Date) {
      return local.getTime() !== remote.getTime();
    }

    // Handle primitives
    return local !== remote;
  }

  // Resolve conflict with user choice
  resolveConflict(
    conflictId: string,
    resolution: 'local' | 'remote' | 'merged',
    mergedData?: any
  ): any {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) {
      throw new Error(`Conflict ${conflictId} not found`);
    }

    let resolvedData: any;

    switch (resolution) {
      case 'local':
        resolvedData = {
          ...conflict.localVersion,
          version: Math.max(conflict.localVersion.version, conflict.remoteVersion.version) + 1,
          lastModified: new Date(),
        };
        break;

      case 'remote':
        resolvedData = {
          ...conflict.remoteVersion,
          version: conflict.remoteVersion.version,
        };
        break;

      case 'merged':
        if (!mergedData) {
          throw new Error('Merged data required for merge resolution');
        }
        resolvedData = {
          ...mergedData,
          version: Math.max(conflict.localVersion.version, conflict.remoteVersion.version) + 1,
          lastModified: new Date(),
        };
        break;

      default:
        throw new Error(`Unknown resolution type: ${resolution}`);
    }

    // Update conflict record
    const updatedConflict = {
      ...conflict,
      resolvedVersion: resolvedData,
      resolution
    };

    this.conflicts.set(conflictId, updatedConflict);
    this.notifyConflictListeners();

    toast({
      title: "Konflikt rozwiązany",
      description: `Konflikt w ${this.getCollectionDisplayName(conflict.collection)} został rozwiązany.`,
    });

    return resolvedData;
  }

  // Auto-merge compatible changes
  autoMergeChanges(local: any, remote: any, baseVersion?: any): any | null {
    try {
      // Simple auto-merge strategy: combine non-conflicting changes
      const merged = { ...local };

      // Apply remote changes that don't conflict with local changes
      for (const [key, remoteValue] of Object.entries(remote)) {
        if (key === 'version' || key === 'lastModified' || key === 'lastModifiedBy') {
          continue; // Skip metadata
        }

        const localValue = local[key];
        const baseValue = baseVersion?.[key];

        // If local hasn't changed but remote has, use remote
        if (this.deepEqual(localValue, baseValue) && !this.deepEqual(remoteValue, baseValue)) {
          merged[key] = remoteValue;
        }
        // If both changed to the same value, use it
        else if (this.deepEqual(localValue, remoteValue)) {
          merged[key] = localValue;
        }
        // If only local changed, keep local (already in merged)
        // If both changed differently, this needs manual resolution
        else if (!this.deepEqual(localValue, baseValue) && !this.deepEqual(remoteValue, baseValue)) {
          return null; // Cannot auto-merge
        }
      }

      return {
        ...merged,
        version: Math.max(local.version || 0, remote.version || 0) + 1,
        lastModified: new Date(),
      };
    } catch (error) {
      console.error('Auto-merge failed:', error);
      return null;
    }
  }

  // Deep equality check
  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (a == null || b == null) return a === b;
    if (typeof a !== 'object' || typeof b !== 'object') return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => this.deepEqual(a[key], b[key]));
  }

  // Get display name for collection
  private getCollectionDisplayName(collection: string): string {
    const names: Record<string, string> = {
      gardens: 'ogrodzie',
      tasks: 'zadaniu',
      notifications: 'powiadomieniu',
      activities: 'aktywności'
    };
    return names[collection] || collection;
  }

  // Get all pending conflicts
  getPendingConflicts(): ConflictResolution[] {
    return Array.from(this.conflicts.values()).filter(c => c.resolution === 'pending');
  }

  // Get all conflicts
  getAllConflicts(): ConflictResolution[] {
    return Array.from(this.conflicts.values());
  }

  // Remove resolved conflict
  removeConflict(conflictId: string): void {
    this.conflicts.delete(conflictId);
    this.notifyConflictListeners();
  }

  // Add conflict listener
  addConflictListener(listener: (conflicts: ConflictResolution[]) => void): void {
    this.conflictListeners.push(listener);
  }

  // Remove conflict listener
  removeConflictListener(listener: (conflicts: ConflictResolution[]) => void): void {
    this.conflictListeners = this.conflictListeners.filter(l => l !== listener);
  }

  // Notify conflict listeners
  private notifyConflictListeners(): void {
    const conflicts = this.getPendingConflicts();
    this.conflictListeners.forEach(listener => listener(conflicts));
  }

  // Clear all conflicts
  clearConflicts(): void {
    this.conflicts.clear();
    this.notifyConflictListeners();
  }
}

// Export singleton instance
export const conflictResolutionService = new ConflictResolutionService();
export default conflictResolutionService;