const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firebaseApp = admin.initializeApp(functions.config().firebase);
const db = firebaseApp.firestore();

// TODO
// - Make document ID a hash of the email, and use to enforce unique emails
// - validate input data fields. Perhaps https://hapi.dev/module/joi/#usage
//   - Ensure multiple commitments can't be added for the same email
//   - Validate the semantic fields: email, zip, etc
exports.createCommitment = functions.https.onCall((data, context) => {
  // Create the commitment doc
  const commitmentsRef = db
    .collection('commitments');

  return commitmentsRef
    .add(data)
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
// - https://firebase.google.com/docs/firestore/extend-with-functions
//
// TODO: Should probably move this logic into the createCommitment function using
// a batched write (https://cloud.google.com/firestore/docs/manage-data/transactions#batched-writes)
// to ensure new commitment doc and aggregate count doc are created/updated atomically
exports.updateAggregateCounts = functions.firestore
  .document('commitments/{commitmentId}')
  .onCreate((snap, context) => {
    const newCommitment = snap.data();
    let {
      commitments,
      zip,
    } = newCommitment;

    // Handle un-entered zip code. Empty string breaks firestore dot notation
    // https://firebase.google.com/docs/firestore/manage-data/add-data#update_fields_in_nested_objects
    zip = zip === '' ? 'none' : zip;

    const commitmentId = snap.id;
    const countRef = db.collection('aggregate').doc('countsByZip');
    const plus1 = admin.firestore.FieldValue.increment(1);

    return countRef.get()
      .then((doc) => {
        if (doc.exists) {
          const updatesObj = {};
          const trueCommitmentKeys = Object.keys(commitments).filter(k => commitments[k]);
          trueCommitmentKeys.forEach(commitmentKey => updatesObj[`${commitmentKey}.${zip}`] = plus1);

          console.log(`Incrementing aggregate counts: commitmentId:${commitmentId}. zip:${zip}. commitments:${trueCommitmentKeys}`);
          return countRef.update(updatesObj);
        } else {
          const initialCounts = {};
          Object.keys(commitments).forEach(commitmentKey => {
            initialCounts[commitmentKey] = commitments[commitmentKey] ? { [zip]: plus1 } : {}
          });

          console.log('Creating aggregate counts doc');
          return countRef.set(initialCounts);
        }
      })
      .catch(err => console.error(err));
  });
