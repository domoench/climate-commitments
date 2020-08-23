const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firebaseApp = admin.initializeApp(functions.config().firebase);
const db = firebaseApp.firestore();

// TODO
// - validate input data fields. Perhaps https://hapi.dev/module/joi/#usage, or typescript?
//   - Validate the semantic fields: email, zip, etc
// - Replace zip with post code
exports.createCommitment = functions.https.onCall(async (data, context) => {
  let {
    commitments,
    zip,
  } = data;

  // Handle un-entered zip code. Empty string breaks firestore dot notation
  // https://firebase.google.com/docs/firestore/manage-data/add-data#update_fields_in_nested_objects
  zip = zip === '' ? 'none' : zip;

  const commitmentId = data.email;
  const commitmentRef = db.collection('commitments').doc(commitmentId);
  const aggregateRef = db.collection('aggregate').doc('all');
  const plus1 = admin.firestore.FieldValue.increment(1);

  // TODO sanitizer.sanitizeText(text); See https://firebase.google.com/docs/functions/callable#sending_back_the_result

  try {
    // Run individual and aggregate doc updates together in a transaction to ensure consistency
    await db.runTransaction(async (transaction) => {
      // I. Get all pre-existing commitments
      const allCommitments = [];
      const allCommitmentsRef = db.collection('commitments');
      const allCommitmentsSnapshot = await transaction.get(allCommitmentsRef);
      const aggregateDoc = await transaction.get(aggregateRef);
      allCommitmentsSnapshot.forEach(commitment => {
        allCommitments.push(commitment.data())
      });

      // II. Write new commitment doc
      const commitmentDoc = await transaction.get(commitmentRef);
      if (commitmentDoc.exists) {
        throw new Error(`Commitment doc already exists: id:${commitmentId}.`);
      }
      const commitmentData = {
        ...data,
        zip,
        createdAt: new Date(),
      };
      await transaction.set(commitmentRef, commitmentData);

      // III. Write new aggregate doc
      // Aggregate doc shape is:
      //   {
      //     commitments: [...]
      //   }
      if (!aggregateDoc.exists) {
        const newCommitments = { commitments: [data] };
        console.log('Creating aggr doc. newCommitments', newCommitments);
        transaction.set(aggregateRef, newCommitments);
      } else {
        const preExistingCommitments = aggregateDoc.data().commitments;
        const newCommitments = { commitments: [...preExistingCommitments, data] };
        console.log('Updating aggr doc. newCommitments', newCommitments);
        transaction.update(aggregateRef, newCommitments);
      }
    });
  } catch (e) {
    console.error('Transaction failure:', e);
  }
});
