const config = {
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

  if (isLocalDev()) {
    console.log('Local Development. Communicating with firebase emulators');
    firebase.functions().useFunctionsEmulator('http://localhost:5001');
    firebase.firestore().settings({
      host: 'localhost:8080',
      ssl: false,
    });
  }

  firebaseCache = firebase;
  return firebase;
}

export default getFirebase;
