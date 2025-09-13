# Firebase Setup Guide

This guide will help you set up Firebase for your Ogród (Garden) app with authentication, Firestore database, and push notifications.

## Prerequisites

1. Create a [Firebase project](https://console.firebase.google.com/)
2. Enable the following services in your Firebase project:
   - Authentication
   - Firestore Database
   - Cloud Messaging

## Step 1: Firebase Project Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select your existing project
3. Follow the setup wizard

### Enable Authentication

1. Go to **Authentication** > **Sign-in method**
2. Enable these providers:
   - **Email/Password**
   - **Google** (optional but recommended)

### Enable Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location

### Enable Cloud Messaging

1. Go to **Project Settings** > **Cloud Messaging**
2. Generate a **Web Push certificate** (VAPID key)

## Step 2: Get Firebase Configuration

1. Go to **Project Settings** > **General**
2. Scroll down to **Your apps**
3. Click **Add app** > **Web**
4. Register your app with a nickname
5. Copy the Firebase configuration object

## Step 3: Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase configuration in `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_FIREBASE_VAPID_KEY=your_vapid_key
   ```

## Step 4: Update Service Worker

Edit `public/firebase-messaging-sw.js` and replace the placeholder configuration with your actual Firebase config:

```javascript
firebase.initializeApp({
  apiKey: "your_api_key_here",
  authDomain: "your_project.firebaseapp.com",
  projectId: "your_project_id",
  storageBucket: "your_project.appspot.com",
  messagingSenderId: "your_sender_id",
  appId: "your_app_id"
});
```

## Step 5: Firestore Security Rules

Set up security rules in **Firestore Database** > **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 6: Install Dependencies

Make sure all required dependencies are installed:

```bash
npm install
```

## Step 7: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Try to register a new account
3. Check if data is being saved to Firestore
4. Test push notifications (you'll need to allow notifications in your browser)

## Features Included

### 🔐 Authentication
- Email/Password registration and login
- Google Sign-in
- Password reset
- Protected routes

### 📊 Data Storage
- User-specific garden data
- Real-time sync with Firestore
- Offline support (coming soon)

### 🔔 Push Notifications
- Foreground and background notifications
- Task reminders
- Custom notification settings

### 📱 Progressive Web App
- Service Worker for offline capabilities
- Installable on mobile devices
- Push notifications support

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Check your `.env.local` file
2. **Authentication errors**: Verify auth providers are enabled
3. **Permission denied**: Check Firestore security rules
4. **Notifications not working**: Ensure VAPID key is correct and service worker is registered

### Development vs Production

- For development, use **test mode** for Firestore
- For production, implement proper security rules
- Never commit your `.env.local` file to version control

## Next Steps

1. Customize the notification settings
2. Add more authentication providers
3. Implement offline support
4. Add data backup/restore functionality
5. Set up analytics and monitoring

## Support

If you encounter issues, check:
1. Firebase Console logs
2. Browser developer tools
3. Network tab for failed requests
4. Firebase documentation

Happy gardening! 🌱