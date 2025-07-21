import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, getIdTokenResult, onIdTokenChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getStorage } from 'firebase/storage'; // Add this import

const firebaseConfig = {
    apiKey: "AIzaSyDLMJv5uMy8QbT4r2uMdDxQ-bbSgizHvdg",
    authDomain: "bellebeauaesthetics-c1199.firebaseapp.com",
    projectId: "bellebeauaesthetics-c1199",
    storageBucket: "bellebeauaesthetics-c1199.appspot.com",
    messagingSenderId: "893744528427",
    appId: "1:893744528427:web:a31ddada2407f52d1ebe6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const baseStorage = getStorage(app); // Initialize base storage first

// Create a custom storage instance that forces the correct URL
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

// Initialize other services
const messaging = getMessaging(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Verification
console.log("Storage initialized with bucket:", storage._location.bucket);
console.log("Sample upload URL:", storage.ref('test.jpg').toString());

// Export all services
export {
    auth,
    db,
    app,
    messaging,
    storage, // Export the custom storage instance
    onAuthStateChanged,
    signOut,
    getIdTokenResult,
    onIdTokenChanged
};
export const requestNotificationPermission = async (userId) => {
    try {
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service workers not supported');
        }

        // Try to get existing registration first
        let registration = await navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope');

        if (!registration) {
            registration = await navigator.serviceWorker.register(
                '/firebase-messaging-sw.js',
                { scope: '/firebase-cloud-messaging-push-scope' }
            );

            // Wait for service worker to be ready
            if (registration.installing) {
                await new Promise(resolve => {
                    registration.installing.addEventListener('statechange', (e) => {
                        if (e.target.state === 'activated') {
                            resolve();
                        }
                    });
                });
            }
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('Permission not granted');
        }

        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        if (!token) {
            throw new Error('No token received');
        }

        return token;
    } catch (error) {
        console.error('Notification permission error:', error);
        throw error;
    }
};

// Handle incoming messages
export const setupMessageHandler = (callback) => {
    return onMessage(messaging, (payload) => {
        callback(payload);
    });
};
