const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firebaseApp = admin.initializeApp(functions.config().firebase);
const db = firebaseApp.firestore();

exports.createCommitment = functions.https.onCall((data, context) => {
  console.log('data', data);

  // Create the commitment doc
  const commitmentsRef = db
    .collection('commitments');

  return commitmentsRef
    .add(data) // TODO validate input data fields
    .then(docRef => {
      console.log(`Added commitment doc id:${docRef.id}`);
      return { success: true };
    })
    .catch(err => {
      // TODO: https://firebase.google.com/docs/functions/callable#handle_errors
      console.error(err);
      return { success: false };
    });
});

// Firestore change triggered callback
// https://firebase.google.com/docs/firestore/extend-with-functions
exports.updateAggregateCounts = functions.firestore
  .document('commitments/{commitmentId}')
  .onCreate((snap, context) => {
    const newValue = snap.data();

    const countRef = db.collection('aggregate').doc('countsByZip');
    countRef.get() // TODO return this whole thing
      .then((doc) => {
        if (doc.exists) {
          console.log('Incrementing aggregate counts');
          return countRef.update({
            callBank: admin.firestore.FieldValue.increment(1),
            // TODO
          });
        } else {
          console.log('Creating aggregate counts doc');
          return countRef.set({
            callBank: 1,
            // TODO
          });
        }
      })
      .catch(err => console.error(err));
      return 0; // TODO
  });
