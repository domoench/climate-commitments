const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firebaseApp = admin.initializeApp(functions.config().firebase);
const db = firebaseApp.firestore();

// TODO
// - validate input data fields. Perhaps https://hapi.dev/module/joi/#usage
//   - Validate the semantic fields: email, zip, etc
exports.createCommitment = functions.https.onCall((data, context) => {
  let {
    commitments,
    zip,
  } = data;

  // Handle un-entered zip code. Empty string breaks firestore dot notation
  // https://firebase.google.com/docs/firestore/manage-data/add-data#update_fields_in_nested_objects
  zip = zip === '' ? 'none' : zip;

  const commitmentId = data.email;
  const commitmentRef = db.collection('commitments').doc(commitmentId);
  const countRef = db.collection('aggregate').doc('countsByZip');
  const plus1 = admin.firestore.FieldValue.increment(1);

  db.runTransaction(transaction => {
    // I. Update aggregate count document
    const aggrPromise = transaction.get(countRef).then(doc => {
      const trueCommitmentKeys = Object.keys(commitments).filter(k => commitments[k]);

      if (!doc.exists) {
        const initialCounts = {};
        Object.keys(commitments).forEach(commitmentKey => {
          initialCounts[commitmentKey] = commitments[commitmentKey] ? { [zip]: plus1 } : {}
        });
        transaction.set(countRef, initialCounts);
      }

      const updatesObj = {};
      trueCommitmentKeys.forEach(commitmentKey => updatesObj[`${commitmentKey}.${zip}`] = plus1);
      transaction.update(countRef, updatesObj);
      return `commitmentId:${commitmentId}. commitments:${trueCommitmentKeys}.`;
    })

    // II. Create individual commitment document
    const commitPromise = transaction.get(commitmentRef).then(doc => {
      if (doc.exists) {
        throw new Error(`Commitment doc already exists: id:${commitmentId}.`);
      }

      transaction.set(commitmentRef, data);
      return data;
    })

    return Promise.all([aggrPromise, commitPromise]);
  }).then((values) => {
    console.log('Incremented aggregate counts doc: ', values[0])
    console.log('Created commitment doc: ', values[1])
    return Promise.resolve();
  }).catch(err => console.error('Transaction error: ', err));
});
