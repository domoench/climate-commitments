const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const firebaseApp = admin.initializeApp(functions.config().firebase);
const db = firebaseApp.firestore();

const expressApp = express();
expressApp.use(cors({ origin: true }));

expressApp.post('/', (req, res) => {
  // TODO Validate recaptcha
  console.log('body', req.body);

  // Create the commitment doc
  const commitmentsRef = db
    .collection('commitments');

  commitmentsRef
    .add(req.body) // TODO validate input data fields
    .then(docRef => {
      console.log(`Added commitment doc id:${docRef.id}`);
      res.status(200).send('OK');
      return;
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

exports.createCommitment = functions.https.onRequest(expressApp);

// Firestore change triggered callback
// https://firebase.google.com/docs/firestore/extend-with-functions
exports.updateAggregateCounts = functions.firestore
  .document('commitments/{commitmentId}')
  .onCreate((snap, context) => {
    const newValue = snap.data();

    const countRef = db.collection('aggregate').doc('countsByZip');
    countRef.get()
      .then((doc) => {
        if (doc.exists) {
          console.log('Incrementing aggregate counts');
          console.log('db deets', doc._ref._firestore._settings);
          return countRef.update({
            callBank: admin.firestore.FieldValue.increment(1),
            // TODO
          });
        } else {
          console.log('Creating aggregate counts doc');
          return countRef.set({
            callBank: 0,
            // TODO
          });
        }
      })
      .catch(err => console.error(err));
      return 0; // TODO
  })

// TODO: Set up aggregate doc updating via a firestore onCreate trigger: https://firebase.google.com/docs/firestore/extend-with-functions#function_triggers
