const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize with explicit configuration
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, '\n')
    }),
    projectId: serviceAccount.project_id, // Explicit at root level
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    storageBucket: `${serviceAccount.project_id}.appspot.com`
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

// Test connections
db.collection('_test').doc('connection').set({ timestamp: new Date() })
    .then(() => console.log('✅ Firestore connection verified'))
    .catch(err => console.error('❌ Firestore test failed:', err));

module.exports = { admin, db, auth, storage, firebaseApp };