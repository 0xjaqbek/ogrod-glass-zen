// src/lib/operationQueueService.ts
import { SyncOperation } from '@/types/garden';
import { toast } from '@/hooks/use-toast';

class OperationQueueService {
  private operations: Map<string, SyncOperation> = new Map();
  private isProcessing: boolean = false;
  private processingListeners: ((isProcessing: boolean) => void)[] = [];
  private queueListeners: ((operations: SyncOperation[]) => void)[] = [];

  // Priority order (higher number = higher priority)
  private priorityOrder: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  // Maximum retry counts per priority
  private maxRetries: Record<string, number> = {
    critical: 10,
    high: 5,
    medium: 3,
    low: 2
  };

  // Add operation to queue
  addOperation(operation: Omit<SyncOperation, 'id' | 'retryCount' | 'timestamp'>): string {
    const id = this.generateOperationId();
    const fullOperation: SyncOperation = {
      ...operation,
      id,
      retryCount: 0,
      timestamp: Date.now()
    };

    this.operations.set(id, fullOperation);
    this.notifyQueueListeners();

    console.log(`Added operation to queue: ${operation.type} ${operation.collection}/${operation.documentId}`);

    // Start processing if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }

    return id;
  }

  // Get operation by ID
  getOperation(operationId: string): SyncOperation | undefined {
    return this.operations.get(operationId);
  }

  // Get all operations
  getAllOperations(): SyncOperation[] {
    return Array.from(this.operations.values()).sort(this.compareOperations.bind(this));
  }

  // Get pending operations
  getPendingOperations(): SyncOperation[] {
    return this.getAllOperations().filter(op => !op.error || op.retryCount < this.maxRetries[op.priority]);
  }

  // Get failed operations
  getFailedOperations(): SyncOperation[] {
    return this.getAllOperations().filter(op => op.error && op.retryCount >= this.maxRetries[op.priority]);
  }

  // Remove operation from queue
  removeOperation(operationId: string): boolean {
    const removed = this.operations.delete(operationId);
    if (removed) {
      this.notifyQueueListeners();
    }
    return removed;
  }

  // Clear all operations
  clearQueue(): void {
    this.operations.clear();
    this.notifyQueueListeners();
  }

  // Clear failed operations
  clearFailedOperations(): void {
    const failedIds = this.getFailedOperations().map(op => op.id);
    failedIds.forEach(id => this.operations.delete(id));
    this.notifyQueueListeners();

    if (failedIds.length > 0) {
      toast({
        title: "Błędne operacje usunięte",
        description: `Usunięto ${failedIds.length} nieudanych operacji z kolejki.`,
      });
    }
  }

  // Retry failed operations
  retryFailedOperations(): void {
    const failedOperations = this.getFailedOperations();

    failedOperations.forEach(operation => {
      const retryOperation: SyncOperation = {
        ...operation,
        retryCount: 0,
        error: undefined,
        lastRetryTime: undefined,
        timestamp: Date.now()
      };
      this.operations.set(operation.id, retryOperation);
    });

    this.notifyQueueListeners();

    if (failedOperations.length > 0) {
      toast({
        title: "Ponowne próby operacji",
        description: `Rozpoczęto ponowne próby ${failedOperations.length} operacji.`,
      });

      if (!this.isProcessing) {
        this.processQueue();
      }
    }
  }

  // Process queue
  async processQueue(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    this.notifyProcessingListeners();

    try {
      const pendingOps = this.getPendingOperations();

      if (pendingOps.length === 0) {
        return;
      }

      console.log(`Processing ${pendingOps.length} operations from queue`);

      // Process operations in priority order
      for (const operation of pendingOps) {
        await this.processOperation(operation);

        // Small delay between operations to prevent overwhelming the server
        await this.delay(100);
      }
    } catch (error) {
      console.error('Error processing operation queue:', error);
    } finally {
      this.isProcessing = false;
      this.notifyProcessingListeners();
    }
  }

  // Process individual operation
  private async processOperation(operation: SyncOperation): Promise<void> {
    const shouldRetry = this.shouldRetryOperation(operation);

    if (!shouldRetry) {
      console.log(`Skipping operation ${operation.id} - max retries exceeded`);
      return;
    }

    try {
      console.log(`Processing operation: ${operation.type} ${operation.collection}/${operation.documentId} (attempt ${operation.retryCount + 1})`);

      // Update retry count and time
      const updatedOperation: SyncOperation = {
        ...operation,
        retryCount: operation.retryCount + 1,
        lastRetryTime: Date.now(),
        error: undefined
      };
      this.operations.set(operation.id, updatedOperation);

      // Execute the operation (this would be handled by the sync service)
      await this.executeOperation(updatedOperation);

      // Operation succeeded - remove from queue
      this.operations.delete(operation.id);
      console.log(`Operation ${operation.id} completed successfully`);

    } catch (error) {
      console.error(`Operation ${operation.id} failed:`, error);

      // Update operation with error
      const failedOperation: SyncOperation = {
        ...operation,
        retryCount: operation.retryCount + 1,
        lastRetryTime: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      this.operations.set(operation.id, failedOperation);

      // Schedule retry if within limits
      if (failedOperation.retryCount < this.maxRetries[operation.priority]) {
        const retryDelay = this.calculateRetryDelay(failedOperation.retryCount, operation.priority);
        console.log(`Scheduling retry for operation ${operation.id} in ${retryDelay}ms`);

        setTimeout(() => {
          if (this.operations.has(operation.id) && !this.isProcessing) {
            this.processQueue();
          }
        }, retryDelay);
      } else {
        console.error(`Operation ${operation.id} failed permanently after ${failedOperation.retryCount} retries`);

        toast({
          title: "Operacja nieudana",
          description: `${this.getOperationDescription(operation)} nie powiodła się po ${failedOperation.retryCount} próbach.`,
          variant: "destructive"
        });
      }
    } finally {
      this.notifyQueueListeners();
    }
  }

  // Execute operation (placeholder - would be implemented by sync service)
  private async executeOperation(operation: SyncOperation): Promise<void> {
    // This is a placeholder - the actual implementation would be in syncService
    // For now, we'll simulate operation execution
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate occasional failures for testing
        if (Math.random() < 0.1) { // 10% failure rate
          reject(new Error('Simulated network error'));
        } else {
          resolve();
        }
      }, Math.random() * 1000 + 500);
    });
  }

  // Check if operation should be retried
  private shouldRetryOperation(operation: SyncOperation): boolean {
    // Don't retry if max retries exceeded
    if (operation.retryCount >= this.maxRetries[operation.priority]) {
      return false;
    }

    // Don't retry if last retry was too recent
    if (operation.lastRetryTime) {
      const retryDelay = this.calculateRetryDelay(operation.retryCount, operation.priority);
      const timeSinceLastRetry = Date.now() - operation.lastRetryTime;

      if (timeSinceLastRetry < retryDelay) {
        return false;
      }
    }

    return true;
  }

  // Calculate exponential backoff delay
  private calculateRetryDelay(retryCount: number, priority: string): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 60000; // 1 minute

    // Priority multiplier (higher priority = shorter delay)
    const priorityMultiplier = {
      critical: 0.5,
      high: 0.75,
      medium: 1,
      low: 1.5
    }[priority] || 1;

    // Exponential backoff with jitter
    const exponentialDelay = Math.min(
      baseDelay * Math.pow(2, retryCount - 1) * priorityMultiplier,
      maxDelay
    );

    // Add jitter (±25%)
    const jitter = 0.25 * exponentialDelay * (Math.random() * 2 - 1);

    return Math.max(1000, exponentialDelay + jitter);
  }

  // Compare operations for sorting (higher priority first, then by timestamp)
  private compareOperations(a: SyncOperation, b: SyncOperation): number {
    const priorityDiff = this.priorityOrder[b.priority] - this.priorityOrder[a.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    return a.timestamp - b.timestamp; // Earlier timestamp first
  }

  // Get operation description for user messages
  private getOperationDescription(operation: SyncOperation): string {
    const collectionNames: Record<string, string> = {
      gardens: 'ogrodu',
      tasks: 'zadania',
      notifications: 'powiadomienia',
      activities: 'aktywności'
    };

    const actionNames: Record<string, string> = {
      create: 'Tworzenie',
      update: 'Aktualizacja',
      delete: 'Usuwanie'
    };

    const collection = collectionNames[operation.collection] || operation.collection;
    const action = actionNames[operation.type] || operation.type;

    return `${action} ${collection}`;
  }

  // Generate unique operation ID
  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Utility delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Add processing listener
  addProcessingListener(listener: (isProcessing: boolean) => void): void {
    this.processingListeners.push(listener);
  }

  // Remove processing listener
  removeProcessingListener(listener: (isProcessing: boolean) => void): void {
    this.processingListeners = this.processingListeners.filter(l => l !== listener);
  }

  // Notify processing listeners
  private notifyProcessingListeners(): void {
    this.processingListeners.forEach(listener => listener(this.isProcessing));
  }

  // Add queue listener
  addQueueListener(listener: (operations: SyncOperation[]) => void): void {
    this.queueListeners.push(listener);
  }

  // Remove queue listener
  removeQueueListener(listener: (operations: SyncOperation[]) => void): void {
    this.queueListeners = this.queueListeners.filter(l => l !== listener);
  }

  // Notify queue listeners
  private notifyQueueListeners(): void {
    const operations = this.getAllOperations();
    this.queueListeners.forEach(listener => listener(operations));
  }

  // Get queue statistics
  getQueueStats(): {
    total: number;
    pending: number;
    failed: number;
    byPriority: Record<string, number>;
    byType: Record<string, number>;
  } {
    const all = this.getAllOperations();
    const pending = this.getPendingOperations();
    const failed = this.getFailedOperations();

    const byPriority: Record<string, number> = {};
    const byType: Record<string, number> = {};

    all.forEach(op => {
      byPriority[op.priority] = (byPriority[op.priority] || 0) + 1;
      byType[op.type] = (byType[op.type] || 0) + 1;
    });

    return {
      total: all.length,
      pending: pending.length,
      failed: failed.length,
      byPriority,
      byType
    };
  }

  // Check if queue is processing
  isQueueProcessing(): boolean {
    return this.isProcessing;
  }
}

// Export singleton instance
export const operationQueueService = new OperationQueueService();
export default operationQueueService;