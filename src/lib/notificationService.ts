// src/lib/notificationService.ts
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase';

// Request notification permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!messaging) {
      console.log('Firebase messaging not supported in this browser');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // Get registration token
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      if (token) {
        console.log('FCM registration token:', token);
        return token;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } else {
      console.log('Unable to get permission to notify.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
};

// Store FCM token in Firestore for the current user
export const storeFCMToken = async (userId: string, token: string) => {
  try {
    // You can store this in Firestore to send targeted notifications
    const tokenData = {
      token,
      userId,
      timestamp: new Date(),
      platform: 'web'
    };
    
    // Store in local storage for now, you can extend this to save to Firestore
    localStorage.setItem('fcm_token', token);
    console.log('FCM token stored successfully');
  } catch (error) {
    console.error('Error storing FCM token:', error);
  }
};

// Listen for foreground messages
export const onForegroundMessage = (callback: (payload: any) => void) => {
  if (!messaging) {
    console.log('Firebase messaging not available for foreground messages');
    return () => {};
  }

  try {
    return onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      callback(payload);
    });
  } catch (error) {
    console.warn('Error setting up foreground message listener:', error);
    return () => {};
  }
};

// Show browser notification
export const showLocalNotification = (title: string, options: NotificationOptions = {}) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/garden-icon-192.png',
      badge: '/garden-icon-72.png',
      ...options
    });
  }
};

// Schedule local notifications for tasks
export const scheduleTaskReminder = (taskTitle: string, dueDate: Date) => {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    const now = new Date();
    const timeUntilDue = dueDate.getTime() - now.getTime();
    
    // Schedule notification 1 hour before due date
    const reminderTime = Math.max(0, timeUntilDue - (60 * 60 * 1000));
    
    if (reminderTime > 0) {
      setTimeout(() => {
        showLocalNotification(`Przypomnienie o zadaniu`, {
          body: `${taskTitle} - termin: ${dueDate.toLocaleDateString('pl-PL')}`,
          tag: `task-reminder-${taskTitle}`,
          requireInteraction: true
        });
      }, reminderTime);
    }
  }
};

// Initialize notification service
export const initializeNotifications = async (userId: string) => {
  try {
    // Check if browser supports notifications
    if (!isNotificationSupported()) {
      console.log('Notifications not supported in this browser');
      return () => {};
    }

    // Check if Firebase messaging is available
    if (!messaging) {
      console.log('Firebase messaging not available in this browser');
      return () => {};
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered successfully:', registration);
      } catch (swError) {
        console.warn('Service Worker registration failed:', swError);
        // Continue without service worker
      }
    }

    // Request permission and get token
    const token = await requestNotificationPermission();

    if (token && userId) {
      await storeFCMToken(userId, token);
    }

    // Listen for foreground messages
    const unsubscribe = onForegroundMessage((payload) => {
      // Show custom notification in the app
      showLocalNotification(
        payload.notification?.title || 'Powiadomienie z ogrodu',
        {
          body: payload.notification?.body || 'Masz nowe powiadomienie',
          data: payload.data
        }
      );
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return () => {};
  }
};

// Check if notifications are supported
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

// Get current notification permission status
export const getNotificationPermission = (): NotificationPermission => {
  return Notification.permission;
};