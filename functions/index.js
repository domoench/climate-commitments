const functions = require('firebase-functions');
const admin = require('firebase-admin');
const validation = require('./validation/index.js');

const firebaseApp = admin.initializeApp(functions.config().firebase);
const db = firebaseApp.firestore();

class DuplicateEmailError extends Error {}

exports.createCommitment = functions.https.onCall(async (data, context) => {
  const { commitments } = data;
  let { postalCode, name } = data;

  // Validate input data
  const errors = validation.validate(data);
  if (errors.length) {
    console.error('Validation errors: ', errors);
    throw new functions.https.HttpsError('invalid-argument', errors);
  }

  // If no name submitted they chose to be anonymous
  name = name === '' ? 'Anonymous' : name;

  // Handle un-entered postalCode code. Empty string breaks firestore dot notation
  // https://firebase.google.com/docs/firestore/manage-data/add-data#update_fields_in_nested_objects
  postalCode = postalCode === '' ? 'none' : postalCode;

  const commitmentData = {
    ...data,
    postalCode,
    createdAt: new Date(),
  };

  const commitmentId = data.email;
  const commitmentRef = db.collection('commitments').doc(commitmentId);
  const aggregateRef = db.collection('aggregate').doc('all');

  try {
    // Run individual and aggregate doc updates together in a transaction to ensure consistency
    await db.runTransaction(async transaction => {
      // I. Get all pre-existing commitments
      const allCommitments = [];
      const allCommitmentsRef = db.collection('commitments');
      const allCommitmentsSnapshot = await transaction.get(allCommitmentsRef);
      const aggregateDoc = await transaction.get(aggregateRef);
      allCommitmentsSnapshot.forEach(commitment => {
        allCommitments.push(commitment.data());
      });

      // II. Write new commitment doc
      const commitmentDoc = await transaction.get(commitmentRef);
      if (commitmentDoc.exists) {
        throw new DuplicateEmailError(
          `Commitments previously submitted for ${commitmentId}.`
        );
      }
      await transaction.set(commitmentRef, commitmentData);

      // III. Create/Update aggregate doc
      // Aggregate doc shape is:
      //   {
      //     commitments: [...]
      //   }
      if (!aggregateDoc.exists) {
        const newCommitments = { commitments: [commitmentData] };
        console.log('Creating aggr doc. newCommitments', newCommitments);
        transaction.set(aggregateRef, newCommitments);
      } else {
        const preExistingCommitments = aggregateDoc.data().commitments;
        const newCommitments = {
          commitments: [...preExistingCommitments, commitmentData],
        };
        console.log('Updating aggr doc. newCommitments', newCommitments);
        transaction.update(aggregateRef, newCommitments);
      }
    });
    // Return success result
    return commitmentData;
  } catch (e) {
    console.error('Transaction failure:', e);
    if (e instanceof DuplicateEmailError) {
      throw new functions.https.HttpsError('already-exists', e.message);
    } else {
      throw new functions.https.HttpsError('internal');
    }
  }
});
