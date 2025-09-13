// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyA5qUA8cfRPF1spbr0QxfX2gsyQjjEtdHY",
  authDomain: "ogrodnika-ce85e.firebaseapp.com",
  projectId: "ogrodnika-ce85e",
  storageBucket: "ogrodnika-ce85e.firebasestorage.app",
  messagingSenderId: "767211287088",
  appId: "1:767211287088:web:a776edc584f76e163ef3f5",
  measurementId: "G-EYCMQL60WE"
});

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Powiadomienie z ogrodu';
  const notificationOptions = {
    body: payload.notification?.body || 'Masz nowe powiadomienie',
    icon: '/garden-icon-192.png',
    badge: '/garden-icon-72.png',
    tag: 'garden-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Sprawdź'
      },
      {
        action: 'dismiss',
        title: 'Odrzuć'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});