// src/components/SyncStatus.tsx
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import syncService from '@/lib/enhancedSyncService';

interface SyncStatusProps {
  className?: string;
}

export const SyncStatus: React.FC<SyncStatusProps> = ({ className = '' }) => {
  const { currentUser } = useAuth();
  const [syncStatus, setSyncStatus] = useState(() => syncService.getSyncStatus());
  const [lastSyncText, setLastSyncText] = useState<string>('');

  // Update sync status
  const updateSyncStatus = () => {
    const status = syncService.getSyncStatus();
    setSyncStatus(status);

    if (status.lastSync > 0) {
      const now = Date.now();
      const diff = now - status.lastSync;

      if (diff < 60000) { // Less than 1 minute
        setLastSyncText('Just now');
      } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        setLastSyncText(`${minutes}m ago`);
      } else if (diff < 86400000) { // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        setLastSyncText(`${hours}h ago`);
      } else {
        const days = Math.floor(diff / 86400000);
        setLastSyncText(`${days}d ago`);
      }
    } else {
      setLastSyncText('Never');
    }
  };

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => updateSyncStatus();
    const handleOffline = () => updateSyncStatus();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update status every 30 seconds
    const interval = setInterval(updateSyncStatus, 30000);

    // Listen for sync events
    const handleSyncResult = () => {
      setTimeout(updateSyncStatus, 100); // Small delay to ensure state is updated
    };

    syncService.addSyncListener(handleSyncResult);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
      syncService.removeSyncListener(handleSyncResult);
    };
  }, []);

  // Update status on mount and when sync status changes
  useEffect(() => {
    updateSyncStatus();
  }, [syncStatus.lastSync, syncStatus.isOnline, syncStatus.isSyncing]);

  // Manual sync
  const handleManualSync = async () => {
    if (!currentUser || syncStatus.isSyncing) return;

    try {
      await syncService.forcSync(currentUser.uid);
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  // Get status icon
  const getStatusIcon = () => {
    if (syncStatus.isSyncing) {
      return <RefreshCw className="h-4 w-4 animate-spin" />;
    }

    if (!syncStatus.isOnline) {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }

    if (syncStatus.pendingChanges > 0) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }

    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  // Get status text
  const getStatusText = () => {
    if (syncStatus.isSyncing) {
      return 'Syncing...';
    }

    if (!syncStatus.isOnline) {
      return 'Offline';
    }

    if (syncStatus.pendingChanges > 0) {
      return `${syncStatus.pendingChanges} pending`;
    }

    return 'Synced';
  };

  // Get status color
  const getStatusColor = () => {
    if (syncStatus.isSyncing) {
      return 'text-blue-600';
    }

    if (!syncStatus.isOnline) {
      return 'text-red-600';
    }

    if (syncStatus.pendingChanges > 0) {
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