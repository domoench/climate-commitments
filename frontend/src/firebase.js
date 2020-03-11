import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'climate-commitments.firebaseapp.com',
  databaseURL: 'https://climate-commitments.firebaseio.com',
  projectId: 'climate-commitments',
  storageBucket: 'climate-commitments.appspot.com',
  messagingSenderId: '807727542032',
  appId: '1:807727542032:web:c127b458149d6beb8bbf95',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
