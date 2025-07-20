import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, getIdTokenResult, onIdTokenChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getStorage } from 'firebase/storage'; // Add this import

const firebaseConfig = {
    apiKey: "AIzaSyDLMJv5uMy8QbT4r2uMdDxQ-bbSgizHvdg",
    authDomain: "bellebeauaesthetics-c1199.firebaseapp.com",
    projectId: "bellebeauaesthetics-c1199",
    storageBucket: "bellebeauaesthetics-c1199.firebasestorage.app", // Must match exactly
    messagingSenderId: "893744528427",
    appId: "1:893744528427:web:a31ddada2407f52d1ebe6e"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize storage with forced bucket URL
const baseStorage = getStorage(app);
const storage = {
    ...baseStorage,
    _location: {
        ...baseStorage._location,
        bucket: 'bellebeauaesthetics-c1199.firebasestorage.app',
        toString: () => 'bellebeauaesthetics-c1199.firebasestorage.app'
    },
    ref: (path) => {
        const ref = baseStorage.ref(path);
        // Override URL generation
        ref.toString = () => 
            `https://firebasestorage.googleapis.com/v0/b/bellebeauaesthetics-c1199.firebasestorage.app/o/${encodeURIComponent(path)}`;
        return ref;
    }
};

// Verification
console.log("Storage initialized with bucket:", storage._location.bucket);
console.log("Sample upload URL:", storage.ref('test.jpg').toString());

// Export all services including storage
export {
    auth,
    db,
    app,
    messaging,
    storage, // Add this export
    onAuthStateChanged,
    signOut,
    getIdTokenResult,
    onIdTokenChanged
};

// ... rest of your existing code (requestNotificationPermission, setupMessageHandler)
