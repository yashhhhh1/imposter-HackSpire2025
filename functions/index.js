const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.scheduledCleanup = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    console.log('Running scheduled cleanup...');

    const db = admin.firestore();
    const collectionRef = db.collection('your-collection-name');
    
    const now = Date.now();
    const cutoff = now - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    const oldDocsQuery = collectionRef.where('createdAt', '<', cutoff);
    
    const snapshot = await oldDocsQuery.get();
    const deletions = [];
    
    snapshot.forEach(doc => {
        deletions.push(doc.ref.delete());
    });

    await Promise.all(deletions);

    console.log('Cleanup complete.');
    return null;
});
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
    const db = admin.firestore();
    const userRef = db.collection('users').doc(user.uid);
    
    await userRef.set({
        email: user.email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        // Add any other default fields you want
    });

    console.log(`User ${user.uid} created and added to Firestore.`);
});
exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
    const db = admin.firestore();
    const userRef = db.collection('users').doc(user.uid);
    
    await userRef.delete();

    console.log(`User ${user.uid} deleted from Firestore.`);
});