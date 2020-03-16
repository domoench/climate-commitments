const functions = require('firebase-functions');
const admin = require('firebase-admin');

const defaultApp = admin.initializeApp(functions.config().firebase);
const db = defaultApp.firestore();

// TODO remove
exports.helloWorld = functions.https.onRequest((request, response) => {
  // console.log(`App name: ${defaultApp.name}`);
  const commitmentsRef = db
    .collection('commitments');

  // Get the collection
  commitmentsRef
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log('collection -> doc', doc.data());
      })
      return;
    })
    .catch(err => { throw new Error(`You messed up: ${err}`) });
  response.send(`App name: ${defaultApp.name}`);
});

exports.createCommitment = functions.https.onRequest((request, response) => {
  // TODO Validate recaptcha
  console.log('body', request.body);

  // Create the commitment doc

  // Increment the aggregate doc
  response.send('done');
});


// TODO: Set up aggregate doc updating via a firestore onCreate trigger: https://firebase.google.com/docs/firestore/extend-with-functions#function_triggers
