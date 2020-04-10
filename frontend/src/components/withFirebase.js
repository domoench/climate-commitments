import React, { useState, useEffect } from 'react'
import getFirebase from '../firebase'

const withFirebase = WrappedComponent => (props) => {
  const [firebase, setFirebase] = useState(null);

  useEffect(() => {
    const app = import('firebase/app');
    const firestore = import('firebase/firestore');
    const functions = import('firebase/functions');
    Promise.all([app, firestore, functions]).then(values => {
      const firebase = getFirebase(values[0])
      setFirebase(firebase);
    });
  });

  if (!firebase) {
    return null;
  }

  // TODO use Context instead of passing firebase down?
  return (
    <WrappedComponent {...props} firebase={firebase} />
  );
}

export default withFirebase;
