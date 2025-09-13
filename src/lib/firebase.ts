// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyA5qUA8cfRPF1spbr0QxfX2gsyQjjEtdHY",
  authDomain: "ogrodnika-ce85e.firebaseapp.com",
  projectId: "ogrodnika-ce85e",
  storageBucket: "ogrodnika-ce85e.firebasestorage.app",
  messagingSenderId: "767211287088",
  appId: "1:767211287088:web:a776edc584f76e163ef3f5",
  measurementId: "G-EYCMQL60WE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firebase Cloud Messaging (only if supported)
let messaging: any = null;
try {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  }).catch((error) => {
    console.warn('Firebase messaging not supported:', error);
  });
} catch (error) {
  console.warn('Firebase messaging initialization failed:', error);
}

export { messaging };

export default app;