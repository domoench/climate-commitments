const config = {
  // TODO don't these values need to change for staging or dev emulators?
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

let firebaseCache;

const isLocalDev = () => typeof window !== 'undefined' && window.location.hostname === 'localhost';

const getFirebase = firebase => {
  if (firebaseCache) {
    return firebaseCache;
  }

  firebase.initializeApp(config);

  /*
  if (isLocalDev()) {
    console.log('localhost detected!');
    firebase.firestore().settings({
      host: 'localhost:8080',
      ssl: false,
    });
  }
  */

  firebaseCache = firebase;
  return firebase;
}

export default getFirebase;












// Below is stuff that worked with the gatsby-plugin-firebase
/*
const configuredDB = firebase.firestore();

// TODO implement this more fully and get rid of plugin
// https://medium.com/@samshapiro/firebase-local-development-with-firestore-cloud-functions-and-react-c29c188bd60e

const isLocalDev = () => typeof window !== 'undefined' && window.location.hostname === 'localhost';

// if (process.env.NODE_ENV === 'development) { // TODO set up so this be done with gatsby develop
if (isLocalDev()) {
  console.log('localhost detected!');
  console.log('process.env', process.env.NODE_ENV);
  // firebase.functions().useFunctionsEmulator('http://localhost:5001'); // TODO see if this works and can deprecate cloudFunctionsEndpoint
  configuredDB.settings({
    host: 'localhost:8080',
    ssl: false,
  });
}

// TODO this is hardcoded to staging project
// Was unable to get hosting/function rewrites to work, so setting direct cloud functions endpoint here
export const cloudFunctionsEndpoint = () => {
  return (isLocalDev()) ?
    'http://localhost:5001/climate-commitments-staging/us-central1' :
    'https://us-central1-climate-commitments-staging.cloudfunctions.net';
};
// Staging endpoint https://us-central1-climate-commitments-staging.cloudfunctions.net/createCommitment

export const db = configuredDB;
// export const functions = firebase.functions();

// ENVs I need
// 1. Development
//   - Hosting on the emulator
//   - Firestore on the emulator
//   - Functions on the emulator (CORS problem)
// 2. Staging
//   - Hosting/Firestore/Functions all on staging URL
// 2. Production
//   - Hosting/Firestore/Functions all on production URL
//
//
// Options:
// - For dev, I could enable CORs in cloud function. Then could have the react
//   frontend at localhost:8000 via `gatsby develop` then use the above dynamic
//   env cases to set cloud functions and firestore endpoints to the emulator ports
//   (5001 and 8080).
*/
