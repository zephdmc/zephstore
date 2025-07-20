import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDLMJv5uMy8QbT4r2uMdDxQ-bbSgizHvdg",
  authDomain: "bellebeauaesthetics-c1199.firebaseapp.com",
  projectId: "bellebeauaesthetics-c1199",
  storageBucket: "bellebeauaesthetics-c1199.firebasestorage.app", // MUST match exactly
  messagingSenderId: "893744528427",
  appId: "1:893744528427:web:a31ddada2407f52d1ebe6e"
};

// Initialize main app
const app = initializeApp(firebaseConfig);

// Initialize storage with forced bucket
const storage = getStorage(app);
storage._location = {  // Force the correct bucket
  ...storage._location,
  bucket: 'bellebeauaesthetics-c1199.firebasestorage.app'
};

// Initialize messaging
const messaging = getMessaging(app);

// Verification
console.log("Storage bucket locked to:", storage._location.bucket);
console.log("Sample upload URL:", 
  `https://firebasestorage.googleapis.com/v0/b/${storage._location.bucket}/o/test.jpg`);

export { app, storage, messaging };
