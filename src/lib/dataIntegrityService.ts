// src/lib/dataIntegrityService.ts
import { Garden, Task, Activity, Notification, DataIntegrity } from '@/types/garden';
import { toast } from '@/hooks/use-toast';

class DataIntegrityService {
  // Validate and check integrity of all data
  checkDataIntegrity(data: {
    gardens: Garden[];
    tasks: Task[];
    activities: Activity[];
    notifications: Notification[];
  }): DataIntegrity {
    const integrity: DataIntegrity = {
      orphanedTasks: [],
      invalidReferences: [],
      duplicateIds: []
    };

    // Check for duplicate IDs within each collection
    this.checkDuplicateIds('gardens', data.gardens, integrity);
    this.checkDuplicateIds('tasks', data.tasks, integrity);
    this.checkDuplicateIds('activities', data.activities, integrity);
    this.checkDuplicateIds('notifications', data.notifications, integrity);

    // Check for orphaned tasks (tasks referencing non-existent gardens/beds/plants)
    this.checkOrphanedTasks(data.gardens, data.tasks, integrity);

    // Check for invalid references in activities
    this.checkInvalidActivityReferences(data.gardens, data.activities, integrity);

    // Log integrity issues
    if (integrity.orphanedTasks.length > 0 ||
        integrity.invalidReferences.length > 0 ||
        integrity.duplicateIds.length > 0) {
      console.warn('Data integrity issues found:', integrity);

      toast({
        title: "Problemy z integralnością danych",
        description: `Znaleziono ${this.getTotalIssuesCount(integrity)} problemów z danymi.`,
        variant: "destructive"
      });
    }

    return integrity;
  }

  // Check for duplicate IDs in a collection
  private checkDuplicateIds(collectionName: string, items: any[], integrity: DataIntegrity): void {
    const idCounts = new Map<string, number>();

    items.forEach(item => {
      if (item.id) {
        const count = idCounts.get(item.id) || 0;
        idCounts.set(item.id, count + 1);
      }
    });

    idCounts.forEach((count, id) => {
      if (count > 1) {
        integrity.duplicateIds.push({
          collection: collectionName,
          id,
          count
        });
      }
    });
  }

  // Check for orphaned tasks
  private checkOrphanedTasks(gardens: Garden[], tasks: Task[], integrity: DataIntegrity): void {
    const gardenIds = new Set(gardens.map(g => g.id));
    const bedIds = new Set();
    const plantIds = new Set();

    // Collect all bed and plant IDs
    gardens.forEach(garden => {
      garden.beds.forEach(bed => {
        bedIds.add(bed.id);
        bed.plants.forEach(plant => {
          plantIds.add(plant.id);
        });
      });
    });

    tasks.forEach(task => {
      let isOrphaned = false;
      const invalidRefs: string[] = [];

      // Check if garden exists
      if (task.gardenId && !gardenIds.has(task.gardenId)) {
        isOrphaned = true;
        invalidRefs.push(`garden:${task.gardenId}`);
      }

      // Check if bed exists (if specified)
      if (task.bedId && !bedIds.has(task.bedId)) {
        isOrphaned = true;
        invalidRefs.push(`bed:${task.bedId}`);
      }

      // Check if plant exists (if specified)
      if (task.plantId && !plantIds.has(task.plantId)) {
        isOrphaned = true;
        invalidRefs.push(`plant:${task.plantId}`);
      }

      if (isOrphaned) {
        integrity.orphanedTasks.push(task);
        invalidRefs.forEach(ref => {
          integrity.invalidReferences.push({
            type: 'task',
            id: task.id,
            invalidReference: ref
          });
        });
      }
    });
  }

  // Check for invalid references in activities
  private checkInvalidActivityReferences(gardens: Garden[], activities: Activity[], integrity: DataIntegrity): void {
    const gardenIds = new Set(gardens.map(g => g.id));
    const bedIds = new Set();
    const plantIds = new Set();

    // Collect all bed and plant IDs
    gardens.forEach(garden => {
      garden.beds.forEach(bed => {
        bedIds.add(bed.id);
        bed.plants.forEach(plant => {
          plantIds.add(plant.id);
        });
      });
    });

    activities.forEach(activity => {
      // Check if garden exists
      if (activity.gardenId && !gardenIds.has(activity.gardenId)) {
        integrity.invalidReferences.push({
          type: 'activity',
          id: activity.id,
          invalidReference: `garden:${activity.gardenId}`
        });
      }

      // Check if bed exists (if specified)
      if (activity.bedId && !bedIds.has(activity.bedId)) {
        integrity.invalidReferences.push({
          type: 'activity',
          id: activity.id,
          invalidReference: `bed:${activity.bedId}`
        });
      }

      // Check if plant exists (if specified)
      if (activity.plantId && !plantIds.has(activity.plantId)) {
        integrity.invalidReferences.push({
          type: 'activity',
          id: activity.id,
          invalidReference: `plant:${activity.plantId}`
        });
      }
    });
  }

  // Fix data integrity issues automatically where possible
  fixDataIntegrity(data: {
    gardens: Garden[];
    tasks: Task[];
    activities: Activity[];
    notifications: Notification[];
  }, integrity: DataIntegrity): {
    gardens: Garden[];
    tasks: Task[];
    activities: Activity[];
    notifications: Notification[];
  } {
    const fixedData = {
      gardens: [...data.gardens],
      tasks: [...data.tasks],
      activities: [...data.activities],
      notifications: [...data.notifications]
    };

    let fixesApplied = 0;

    // Remove duplicate IDs by keeping the latest version
    integrity.duplicateIds.forEach(duplicate => {
      fixesApplied += this.removeDuplicates(fixedData, duplicate.collection, duplicate.id);
    });

    // Remove orphaned tasks
    if (integrity.orphanedTasks.length > 0) {
      const orphanedIds = new Set(integrity.orphanedTasks.map(t => t.id));
      fixedData.tasks = fixedData.tasks.filter(task => !orphanedIds.has(task.id));
      fixesApplied += integrity.orphanedTasks.length;
    }

    // Remove activities with invalid references
    const invalidActivityIds = new Set(
      integrity.invalidReferences
        .filter(ref => ref.type === 'activity')
        .map(ref => ref.id)
    );
    if (invalidActivityIds.size > 0) {
      fixedData.activities = fixedData.activities.filter(activity => !invalidActivityIds.has(activity.id));
      fixesApplied += invalidActivityIds.size;
    }

    if (fixesApplied > 0) {
      toast({
        title: "Dane naprawione",
        description: `Automatycznie naprawiono ${fixesApplied} problemów z danymi.`,
      });
    }

    return fixedData;
  }

  // Remove duplicates from a collection
  private removeDuplicates(data: any, collection: string, duplicateId: string): number {
    const collectionData = data[collection];
    if (!Array.isArray(collectionData)) return 0;

    // Find all items with the duplicate ID
    const duplicates = collectionData.filter((item: any) => item.id === duplicateId);
    if (duplicates.length <= 1) return 0;

    // Keep the one with the latest lastModified date, or the last one if no dates
    let latest = duplicates[0];
    for (let i = 1; i < duplicates.length; i++) {
      const current = duplicates[i];
      if (current.lastModified && latest.lastModified) {
        if (new Date(current.lastModified) > new Date(latest.lastModified)) {
          latest = current;
        }
      } else if (current.lastModified && !latest.lastModified) {
        latest = current;
      }
    }

    // Remove all duplicates except the latest
    data[collection] = collectionData.filter((item: any) =>
      item.id !== duplicateId || item === latest
    );

    return duplicates.length - 1; // Number of duplicates removed
  }

  // Get total count of integrity issues
  private getTotalIssuesCount(integrity: DataIntegrity): number {
    return integrity.orphanedTasks.length +
           integrity.invalidReferences.length +
           integrity.duplicateIds.length;
  }

  // Validate individual document
  validateDocument(document: any, type: 'garden' | 'task' | 'activity' | 'notification'): string[] {
    const errors: string[] = [];

    // Common validations
    if (!document.id || typeof document.id !== 'string') {
      errors.push('Missing or invalid ID');
    }

    if (document.createdAt && !(document.createdAt instanceof Date) &&
        isNaN(Date.parse(document.createdAt))) {
      errors.push('Invalid createdAt date');
    }

    if (document.lastModified && !(document.lastModified instanceof Date) &&
        isNaN(Date.parse(document.lastModified))) {
      errors.push('Invalid lastModified date');
    }

    // Type-specific validations
    switch (type) {
      case 'garden':
        if (!document.name || typeof document.name !== 'string') {
          errors.push('Missing or invalid garden name');
        }
        if (!Array.isArray(document.beds)) {
          errors.push('Missing or invalid beds array');
        }
        break;

      case 'task':
        if (!document.title || typeof document.title !== 'string') {
          errors.push('Missing or invalid task title');
        }
        if (!document.gardenId || typeof document.gardenId !== 'string') {
          errors.push('Missing or invalid gardenId');
        }
        if (!document.dueDate || (!(document.dueDate instanceof Date) && isNaN(Date.parse(document.dueDate)))) {
          errors.push('Missing or invalid dueDate');
        }
        if (typeof document.completed !== 'boolean') {
          errors.push('Missing or invalid completed status');
        }
        break;

      case 'activity':
        if (!document.action || typeof document.action !== 'string') {
          errors.push('Missing or invalid action');
        }
        if (!document.gardenId || typeof document.gardenId !== 'string') {
          errors.push('Missing or invalid gardenId');
        }
        if (!document.date || (!(document.date instanceof Date) && isNaN(Date.parse(document.date)))) {
          errors.push('Missing or invalid date');
        }
        break;

      case 'notification':
        if (!document.title || typeof document.title !== 'string') {
          errors.push('Missing or invalid notification title');
        }
        if (!document.message || typeof document.message !== 'string') {
          errors.push('Missing or invalid message');
        }
        if (typeof document.read !== 'boolean') {
          errors.push('Missing or invalid read status');
        }
        break;
    }

    return errors;
  }

  // Sanitize document data
  sanitizeDocument(document: any, type: string): any {
    const sanitized = { ...document };

    // Convert date strings to Date objects
    ['createdAt', 'lastModified', 'dueDate', 'date', 'createdDate', 'plantedDate', 'lastWatered', 'lastFertilized'].forEach(field => {
      if (sanitized[field] && typeof sanitized[field] === 'string') {
        const date = new Date(sanitized[field]);
        if (!isNaN(date.getTime())) {
          sanitized[field] = date;
        }
      }
    });

    // Ensure version number exists and is valid
    if (typeof sanitized.version !== 'number' || sanitized.version < 1) {
      sanitized.version = 1;
    }

    // Ensure required metadata exists
    if (!sanitized.createdAt) {
      sanitized.createdAt = new Date();
    }

    if (!sanitized.lastModified) {
      sanitized.lastModified = new Date();
    }

    // Type-specific sanitization
    if (type === 'garden' && !Array.isArray(sanitized.beds)) {
      sanitized.beds = [];
    }

    if (type === 'task' && typeof sanitized.completed !== 'boolean') {
      sanitized.completed = false;
    }

    if (type === 'notification' && typeof sanitized.read !== 'boolean') {
      sanitized.read = false;
    }

    return sanitized;
  }
}

// Export singleton instance
export const dataIntegrityService = new DataIntegrityService();
export default dataIntegrityService;