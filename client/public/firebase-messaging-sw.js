

importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// Firebase config - use environment variables in vite.config.js
const firebaseConfig = {
    apiKey: "AIzaSyDLMJv5uMy8QbT4r2uMdDxQ-bbSgizHvdg", // Replace with your actual API key
    authDomain: "bellebeauaesthetics-c1199.firebaseapp.com",
    projectId: "bellebeauaesthetics-c1199",
    storageBucket: "bellebeauaesthetics-c1199.firebasestorage.app",
    messagingSenderId: "893744528427",
    appId: "1:893744528427:web:a31ddada2407f52d1ebe6e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Nuclear option: Override internal bucket reference
storage._location = {
  ...storage._location,
  bucket: 'bellebeauaesthetics-c1199.firebasestorage.app'
};

// Verify
console.log("Storage initialized with bucket:", storage._location.bucket);
console.log("Full base URL:", `https://${storage._location.host}/v0/b/${storage._location.bucket}`);

export { storage };
// Background message handler
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification?.title || 'New message';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/logo192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});




