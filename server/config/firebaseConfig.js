
const admin = require('firebase-admin');

// Load and parse the JSON from the environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin SDK
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
    }),
    projectId: serviceAccount.project_id,
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    storageBucket: `${serviceAccount.project_id}.appspot.com`
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

// Test Firestore connection
db.collection('_test').doc('connection').set({ timestamp: new Date() })
    .then(() => console.log('✅ Firestore connection verified'))
    .catch(err => console.error('❌ Firestore test failed:', err));

module.exports = { admin, db, auth, storage, firebaseApp };
