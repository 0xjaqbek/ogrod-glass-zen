// src/types/garden.ts
// Re-export types from GardenContext for consistency
export type { Garden, Bed, Plant, Task, Activity, Notification } from '@/contexts/GardenContext';

// Document versioning and sync types
export interface VersionedDocument {
  version: number;
  lastModified: Date;
  lastModifiedBy: string;
  createdAt: Date;
  createdBy: string;
}

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: 'gardens' | 'tasks' | 'notifications' | 'activities';
  documentId: string;
  data?: any;
  timestamp: number;
  userId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  retryCount: number;
  lastRetryTime?: number;
  error?: string;
}

export interface ConflictResolution {
  id: string;
  documentId: string;
  collection: string;
  localVersion: any;
  remoteVersion: any;
  conflictFields: string[];
  resolvedVersion?: any;
  resolution: 'local' | 'remote' | 'merged' | 'pending';
  timestamp: number;
}

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: number;
  pendingOperations: number;
  failedOperations: number;
  conflicts: number;
  syncProgress?: {
    current: number;
    total: number;
    operation: string;
  };
}

export interface DataIntegrity {
  orphanedTasks: Task[];
  invalidReferences: {
    type: 'task' | 'activity';
    id: string;
    invalidReference: string;
  }[];
  duplicateIds: {
    collection: string;
    id: string;
    count: number;
  }[];
}

export interface OptimisticUpdate {
  id: string;
  type: 'create' | 'update' | 'delete';
  collection: string;
  documentId: string;
  originalData?: any;
  optimisticData: any;
  timestamp: number;
  applied: boolean;
}