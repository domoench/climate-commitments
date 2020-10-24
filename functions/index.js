const functions = require('firebase-functions');
const admin = require('firebase-admin');
const validation = require('./validation/index.js');
const { recaptchaVerify } = require('./recaptcha.js');

const firebaseApp = admin.initializeApp(functions.config().firebase);
const db = firebaseApp.firestore();

class DuplicateEmailError extends Error {}

exports.createCommitment = functions.https.onCall(async (data, context) => {
  // Filter incoming data to only the keys we want to persist to database.
  // This ensures we don't persist the recaptcha token, nor any additional
  // fields a malicious request might have appended.
  const allowedKeys = new Set([
    'name',
    'email',
    'postalCode',
    'country',
    'commitments',
  ]);
  const dataToPersist = Object.entries(data).reduce((acc, [key, val]) => {
    if (allowedKeys.has(key)) {
      acc[key] = val;
    }
    return acc;
  }, {});

  // Validate input data that we plan to persist
  const errors = validation.validate(dataToPersist);
  if (Object.keys(errors).length) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      JSON.stringify(errors)
    );
  }

  // Recaptcha verification. Throws an error if verification fails.
  const commitmentId = dataToPersist.email;
  try {
    await recaptchaVerify(data.recaptchaToken)
  } catch (e) {
    console.error(`Recaptcha error for ${commitmentId}:`, e);
    throw new functions.https.HttpsError('internal', 'Recaptcha failure.');
  }

  // Normalize optional fields
  let { postalCode, name } = dataToPersist;
  dataToPersist.name = name === '' ? 'Anonymous' : name;
  dataToPersist.postalCode = postalCode === '' ? 'none' : postalCode;

  // Inject metadata
  dataToPersist.createdAt = new Date();

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
      await transaction.set(commitmentRef, dataToPersist);

      // III. Create/Update aggregate doc
      // Aggregate doc shape is:
      //   {
      //     commitments: [...]
      //   }
      if (!aggregateDoc.exists) {
        const newCommitments = { commitments: [dataToPersist] };
        console.log('Creating aggr doc. newCommitments', newCommitments);
        transaction.set(aggregateRef, newCommitments);
      } else {
        const preExistingCommitments = aggregateDoc.data().commitments;
        const newCommitments = {
          commitments: [...preExistingCommitments, dataToPersist],
        };
        console.log('Updating aggr doc. newCommitments', newCommitments);
        transaction.update(aggregateRef, newCommitments);
      }
    });
    // Return success result
    return dataToPersist;
  } catch (e) {
    console.error('Transaction failure:', e);
    if (e instanceof DuplicateEmailError) {
      throw new functions.https.HttpsError('already-exists', e.message);
    } else {
      throw new functions.https.HttpsError('internal');
    }
  }
});
