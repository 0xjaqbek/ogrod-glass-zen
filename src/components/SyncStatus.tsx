// src/components/SyncStatus.tsx
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle, Clock, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { enhancedSyncService } from '@/lib/enhancedSyncService';
import { conflictResolutionService } from '@/lib/conflictResolutionService';
import { operationQueueService } from '@/lib/operationQueueService';
import { SyncState } from '@/types/garden';
import ConflictResolutionModal from './ConflictResolutionModal';

interface SyncStatusProps {
  className?: string;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ className = '' }) => {
  const { currentUser } = useAuth();
  const [syncState, setSyncState] = useState<SyncState>(() => enhancedSyncService.getSyncState());
  const [lastSyncText, setLastSyncText] = useState<string>('');
  const [showConflictModal, setShowConflictModal] = useState<boolean>(false);

  // Update sync status
  const updateSyncStatus = () => {
    const state = enhancedSyncService.getSyncState();
    setSyncState(state);

    if (state.lastSyncTime > 0) {
      const now = Date.now();
      const diff = now - state.lastSyncTime;

      if (diff < 60000) { // Less than 1 minute
        setLastSyncText('Teraz');
      } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        setLastSyncText(`${minutes}min temu`);
      } else if (diff < 86400000) { // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        setLastSyncText(`${hours}godz temu`);
      } else {
        const days = Math.floor(diff / 86400000);
        setLastSyncText(`${days}dni temu`);
      }
    } else {
      setLastSyncText('Nigdy');
    }
  };

  // Listen for sync state changes
  useEffect(() => {
    const handleStateUpdate = (state: SyncState) => {
      setSyncState(state);
    };

    const handleSyncResult = () => {
      setTimeout(updateSyncStatus, 100);
    };

    enhancedSyncService.addStateListener(handleStateUpdate);
    enhancedSyncService.addSyncListener(handleSyncResult);

    // Update status every 30 seconds
    const interval = setInterval(updateSyncStatus, 30000);

    return () => {
      enhancedSyncService.removeStateListener(handleStateUpdate);
      enhancedSyncService.removeSyncListener(handleSyncResult);
      clearInterval(interval);
    };
  }, []);

  // Update status on mount and when sync state changes
  useEffect(() => {
    updateSyncStatus();
  }, [syncState.lastSyncTime, syncState.isOnline, syncState.isSyncing]);

  // Manual sync
  const handleManualSync = async () => {
    if (!currentUser || syncState.isSyncing) return;

    try {
      await enhancedSyncService.forceSync(currentUser.uid);
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  // Handle conflict resolution
  const handleShowConflicts = () => {
    setShowConflictModal(true);
  };

  const handleConflictResolve = async (conflictId: string, resolvedData: any) => {
    // The conflict is already resolved by the modal
    // Trigger a sync to apply the resolution
    if (currentUser) {
      try {
        await enhancedSyncService.forceSync(currentUser.uid);
      } catch (error) {
        console.error('Sync after conflict resolution failed:', error);
      }
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    if (syncState.isSyncing) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }

    if (!syncState.isOnline) {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }

    if (syncState.conflicts > 0) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }

    if (syncState.pendingOperations > 0 || syncState.failedOperations > 0) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }

    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  // Get status text
  const getStatusText = () => {
    if (syncState.isSyncing) {
      return syncState.syncProgress ?
        `${syncState.syncProgress.operation}... ${syncState.syncProgress.current}/${syncState.syncProgress.total}` :
        'Synchronizacja...';
    }

    if (!syncState.isOnline) {
      return 'Offline';
    }

    if (syncState.conflicts > 0) {
      return `${syncState.conflicts} konfliktów`;
    }

    if (syncState.failedOperations > 0) {
      return `${syncState.failedOperations} błędów`;
    }

    if (syncState.pendingOperations > 0) {
      return `${syncState.pendingOperations} oczekujących`;
    }

    return 'Zsynchronizowane';
  };

  // Get status color
  const getStatusColor = () => {
    if (syncState.isSyncing) {
      return 'text-blue-600';
    }

    if (!syncState.isOnline) {
      return 'text-red-600';
    }

    if (syncState.conflicts > 0) {
      return 'text-red-600';
    }

    if (syncState.failedOperations > 0) {
      return 'text-red-600';
    }

    if (syncState.pendingOperations > 0) {
      return 'text-yellow-600';
    }

    return 'text-green-600';
  };

  return (
    <>
      <div className={`flex items-center space-x-2 ${className}`}>
        <button
          onClick={syncState.conflicts > 0 ? handleShowConflicts : handleManualSync}
          disabled={syncState.isSyncing || !currentUser}
          className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={
            syncState.conflicts > 0 ? 'Rozwiąż konflikty danych' :
            syncState.isOnline ? 'Kliknij aby zsynchronizować' : 'Offline - zmiany zapisane lokalnie'
          }
        >
          {getStatusIcon()}
          <div className="flex flex-col items-start">
            <span className={`text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            {lastSyncText && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {lastSyncText}
              </span>
            )}
          </div>
        </button>

        {!syncState.isOnline && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 rounded-md">
            <WifiOff className="h-3 w-3 text-yellow-600" />
            <span className="text-xs text-yellow-700 dark:text-yellow-400">
              Zmiany zapisane lokalnie
            </span>
          </div>
        )}

        {syncState.failedOperations > 0 && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 rounded-md">
            <AlertCircle className="h-3 w-3 text-red-600" />
            <span className="text-xs text-red-700 dark:text-red-400">
              {syncState.failedOperations} błędów
            </span>
          </div>
        )}
      </div>

      <ConflictResolutionModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        onResolve={handleConflictResolve}
      />
    </>
  );
};

export default SyncStatus;