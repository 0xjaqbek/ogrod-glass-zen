// src/lib/firebaseService.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  onSnapshot,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Garden, Task, Notification, Activity } from '@/types/garden';

// Collection references
const getCollectionRef = (userId: string, collectionName: string) => {
  return collection(db, 'users', userId, collectionName);
};

// Utility function to clean data by removing undefined values
const cleanData = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanData).filter(item => item !== undefined);
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    Object.keys(obj).forEach(key => {
      const value = cleanData(obj[key]);
      if (value !== undefined) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  }

  return obj;
};

// Utility function to safely convert Timestamp to Date
const safeToDate = (timestamp: any): Date | undefined => {
  if (!timestamp) {
    console.log('safeToDate: timestamp is null/undefined');
    return undefined;
  }

  // Check if it's a Firebase Timestamp with toDate method
  if (timestamp && typeof timestamp.toDate === 'function') {
    try {
      const date = timestamp.toDate();
      console.log('safeToDate: converted Firebase timestamp', timestamp, '→', date);
      return date;
    } catch (error) {
      console.warn('Error converting timestamp to date:', error);
      return undefined;
    }
  }

  // Check if it's a Firebase Timestamp object with seconds and nanoseconds
  if (timestamp && typeof timestamp.seconds === 'number') {
    try {
      // Create a Date from seconds (Firebase Timestamps use seconds, not milliseconds)
      const date = new Date(timestamp.seconds * 1000);
      console.log('safeToDate: converted Firebase timestamp object', timestamp, '→', date);
      return date;
    } catch (error) {
      console.warn('Error converting timestamp object to date:', error);
      return undefined;
    }
  }

  // If it's already a Date object
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // If it's a string or number, try to create a Date
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    try {
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? undefined : date;
    } catch (error) {
      console.warn('Error parsing date from string/number:', error);
      return undefined;
    }
  }

  return undefined;
};

// Garden operations
export const saveGardensToFirebase = async (userId: string, gardens: Garden[]) => {
  console.log(`Starting to save ${gardens.length} gardens for user ${userId}`);

  const batch = writeBatch(db);
  const gardensRef = getCollectionRef(userId, 'gardens');

  // Clear existing gardens
  const existingGardens = await getDocs(gardensRef);
  console.log(`Found ${existingGardens.size} existing gardens to delete`);
  existingGardens.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Add new gardens
  gardens.forEach((garden) => {
    console.log(`Processing garden: ${garden.name} with ${garden.beds.length} beds`);
    const gardenRef = doc(gardensRef, garden.id);

    // Convert nested Date objects to Timestamps for Firebase
    const processedGarden = {
      ...garden,
      beds: garden.beds.map(bed => ({
        ...bed,
        plants: bed.plants.map(plant => ({
          ...plant,
          plantedDate: plant.plantedDate ? Timestamp.fromDate(new Date(plant.plantedDate)) : null,
          lastWatered: plant.lastWatered ? Timestamp.fromDate(new Date(plant.lastWatered)) : null
        }))
      })),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const cleanedGarden = cleanData(processedGarden);
    console.log(`Garden ${garden.name} cleaned data:`, cleanedGarden);
    batch.set(gardenRef, cleanedGarden);
  });

  console.log('Committing batch write to Firebase...');
  await batch.commit();
  console.log('Successfully committed gardens to Firebase');
};

export const loadGardensFromFirebase = async (userId: string): Promise<Garden[]> => {
  const gardensRef = getCollectionRef(userId, 'gardens');
  const snapshot = await getDocs(query(gardensRef, orderBy('createdAt', 'asc')));

  return snapshot.docs.map(doc => {
    const data = doc.data();

    // Convert nested Timestamps back to Dates
    const processedGarden = {
      ...data,
      id: doc.id,
      beds: data.beds?.map((bed: any) => ({
        ...bed,
        plants: bed.plants?.map((plant: any) => ({
          ...plant,
          plantedDate: safeToDate(plant.plantedDate),
          lastWatered: safeToDate(plant.lastWatered)
        })) || []
      })) || [],
      createdAt: safeToDate(data.createdAt),
      updatedAt: safeToDate(data.updatedAt)
    };

    return processedGarden as Garden;
  });
};

export const saveGardenToFirebase = async (userId: string, garden: Garden) => {
  const gardenRef = doc(getCollectionRef(userId, 'gardens'), garden.id);

  // Convert nested Date objects to Timestamps for Firebase
  const processedGarden = {
    ...garden,
    beds: garden.beds.map(bed => ({
      ...bed,
      plants: bed.plants.map(plant => ({
        ...plant,
        plantedDate: plant.plantedDate ? Timestamp.fromDate(new Date(plant.plantedDate)) : null,
        lastWatered: plant.lastWatered ? Timestamp.fromDate(new Date(plant.lastWatered)) : null
      }))
    })),
    updatedAt: Timestamp.now()
  };

  const cleanedGarden = cleanData(processedGarden);
  await setDoc(gardenRef, cleanedGarden, { merge: true });
};

export const deleteGardenFromFirebase = async (userId: string, gardenId: string) => {
  const gardenRef = doc(getCollectionRef(userId, 'gardens'), gardenId);
  await deleteDoc(gardenRef);
};

// Task operations
export const saveTasksToFirebase = async (userId: string, tasks: Task[]) => {
  const batch = writeBatch(db);
  const tasksRef = getCollectionRef(userId, 'tasks');
  
  // Clear existing tasks
  const existingTasks = await getDocs(tasksRef);
  existingTasks.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  // Add new tasks
  tasks.forEach((task) => {
    console.log(`Processing task: ${task.title} with dueDate:`, task.dueDate);
    const taskRef = doc(tasksRef, task.id);

    // Ensure dueDate is a valid Date before converting to Timestamp
    let dueDateTimestamp;
    if (task.dueDate instanceof Date) {
      dueDateTimestamp = Timestamp.fromDate(task.dueDate);
    } else if (typeof task.dueDate === 'string' || typeof task.dueDate === 'number') {
      const date = new Date(task.dueDate);
      if (!isNaN(date.getTime())) {
        dueDateTimestamp = Timestamp.fromDate(date);
      } else {
        console.warn(`Invalid date for task ${task.title}:`, task.dueDate);
        dueDateTimestamp = Timestamp.now(); // Fallback to current time
      }
    } else {
      console.warn(`Invalid dueDate type for task ${task.title}:`, typeof task.dueDate, task.dueDate);
      dueDateTimestamp = Timestamp.now(); // Fallback to current time
    }

    const cleanedTask = cleanData({
      ...task,
      dueDate: dueDateTimestamp,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log(`Task ${task.title} cleaned for Firebase:`, cleanedTask);
    batch.set(taskRef, cleanedTask);
  });
  
  await batch.commit();
};

export const loadTasksFromFirebase = async (userId: string): Promise<Task[]> => {
  console.log(`Loading tasks from Firebase for user: ${userId}`);
  const tasksRef = getCollectionRef(userId, 'tasks');
  const snapshot = await getDocs(query(tasksRef, orderBy('dueDate', 'asc')));

  console.log(`Found ${snapshot.docs.length} tasks in Firebase`);

  return snapshot.docs.map(doc => {
    const data = doc.data();
    console.log(`Loading task ${doc.id}:`, data);

    const convertedDueDate = safeToDate(data.dueDate);
    console.log(`Converted dueDate for task ${doc.id}:`, data.dueDate, '→', convertedDueDate);

    const task = {
      ...data,
      id: doc.id,
      dueDate: convertedDueDate,
      createdAt: safeToDate(data.createdAt),
      updatedAt: safeToDate(data.updatedAt)
    } as Task;

    console.log(`Final task object:`, task);
    return task;
  });
};

export const saveTaskToFirebase = async (userId: string, task: Task) => {
  const taskRef = doc(getCollectionRef(userId, 'tasks'), task.id);
  const cleanedTask = cleanData({
    ...task,
    dueDate: Timestamp.fromDate(new Date(task.dueDate)),
    updatedAt: Timestamp.now()
  });
  await setDoc(taskRef, cleanedTask, { merge: true });
};

export const deleteTaskFromFirebase = async (userId: string, taskId: string) => {
  const taskRef = doc(getCollectionRef(userId, 'tasks'), taskId);
  await deleteDoc(taskRef);
};

// Notification operations
export const saveNotificationsToFirebase = async (userId: string, notifications: Notification[]) => {
  const batch = writeBatch(db);
  const notificationsRef = getCollectionRef(userId, 'notifications');
  
  // Clear existing notifications
  const existingNotifications = await getDocs(notificationsRef);
  existingNotifications.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  // Add new notifications
  notifications.forEach((notification) => {
    const notificationRef = doc(notificationsRef, notification.id);
    const cleanedNotification = cleanData({
      ...notification,
      createdDate: Timestamp.fromDate(new Date(notification.createdDate)),
      updatedAt: Timestamp.now()
    });
    batch.set(notificationRef, cleanedNotification);
  });
  
  await batch.commit();
};

export const loadNotificationsFromFirebase = async (userId: string): Promise<Notification[]> => {
  const notificationsRef = getCollectionRef(userId, 'notifications');
  const snapshot = await getDocs(query(notificationsRef, orderBy('createdDate', 'desc')));

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdDate: safeToDate(data.createdDate),
      updatedAt: safeToDate(data.updatedAt)
    } as Notification;
  });
};

export const saveNotificationToFirebase = async (userId: string, notification: Notification) => {
  const notificationRef = doc(getCollectionRef(userId, 'notifications'), notification.id);
  const cleanedNotification = cleanData({
    ...notification,
    createdDate: Timestamp.fromDate(new Date(notification.createdDate)),
    updatedAt: Timestamp.now()
  });
  await setDoc(notificationRef, cleanedNotification, { merge: true });
};

export const deleteNotificationFromFirebase = async (userId: string, notificationId: string) => {
  const notificationRef = doc(getCollectionRef(userId, 'notifications'), notificationId);
  await deleteDoc(notificationRef);
};

// Activity operations
export const saveActivitiesToFirebase = async (userId: string, activities: Activity[]) => {
  const batch = writeBatch(db);
  const activitiesRef = getCollectionRef(userId, 'activities');
  
  // Clear existing activities
  const existingActivities = await getDocs(activitiesRef);
  existingActivities.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  // Add new activities
  activities.forEach((activity) => {
    const activityRef = doc(activitiesRef, activity.id);
    const cleanedActivity = cleanData({
      ...activity,
      date: Timestamp.fromDate(new Date(activity.date)),
      createdAt: Timestamp.now()
    });
    batch.set(activityRef, cleanedActivity);
  });
  
  await batch.commit();
};

export const loadActivitiesFromFirebase = async (userId: string): Promise<Activity[]> => {
  const activitiesRef = getCollectionRef(userId, 'activities');
  const snapshot = await getDocs(query(activitiesRef, orderBy('date', 'desc')));

  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      date: safeToDate(data.date),
      createdAt: safeToDate(data.createdAt)
    } as Activity;
  });
};

export const saveActivityToFirebase = async (userId: string, activity: Activity) => {
  const activitiesRef = getCollectionRef(userId, 'activities');
  const cleanedActivity = cleanData({
    ...activity,
    date: Timestamp.fromDate(new Date(activity.date)),
    createdAt: Timestamp.now()
  });
  await addDoc(activitiesRef, cleanedActivity);
};

// Real-time listeners
export const subscribeToGardens = (userId: string, callback: (gardens: Garden[]) => void) => {
  const gardensRef = getCollectionRef(userId, 'gardens');
  const q = query(gardensRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const gardens = snapshot.docs.map(doc => {
      const data = doc.data();

      // Convert nested Timestamps back to Dates
      const processedGarden = {
        ...data,
        id: doc.id,
        beds: data.beds?.map((bed: any) => ({
          ...bed,
          plants: bed.plants?.map((plant: any) => ({
            ...plant,
            plantedDate: safeToDate(plant.plantedDate),
            lastWatered: safeToDate(plant.lastWatered)
          })) || []
        })) || [],
        createdAt: safeToDate(data.createdAt),
        updatedAt: safeToDate(data.updatedAt)
      };

      return processedGarden as Garden;
    });
    callback(gardens);
  });
};

export const subscribeToTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  const tasksRef = getCollectionRef(userId, 'tasks');
  const q = query(tasksRef, orderBy('dueDate', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        dueDate: safeToDate(data.dueDate),
        createdAt: safeToDate(data.createdAt),
        updatedAt: safeToDate(data.updatedAt)
      } as Task;
    });
    callback(tasks);
  });
};

export const subscribeToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  const notificationsRef = getCollectionRef(userId, 'notifications');
  const q = query(notificationsRef, orderBy('createdDate', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdDate: safeToDate(data.createdDate),
        updatedAt: safeToDate(data.updatedAt)
      } as Notification;
    });
    callback(notifications);
  });
};

// User data operations
export const initializeUserData = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      settings: {
        notifications: true,
        theme: 'dark',
        language: 'pl'
      }
    });
  } else {
    await updateDoc(userRef, {
      lastLogin: Timestamp.now()
    });
  }
};

export const getUserSettings = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    return userDoc.data().settings;
  }
  return null;
};

export const updateUserSettings = async (userId: string, settings: any) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    settings,
    updatedAt: Timestamp.now()
  });
};