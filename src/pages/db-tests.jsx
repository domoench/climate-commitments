import React from 'react';
import firebase from '../firebase';

const DBTestsPage = () => {
  const commitmentsRef = firebase
    .firestore()
    .collection('commitments');

  // Get the collection
  commitmentsRef
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log('collection -> doc', doc.data());
      })
    })
    .catch(err => { throw new Error(`You messed up: ${err}`) });

  // Get a single doc
  commitmentsRef
    .doc('mj9bTP36vnU8qB5lnJO9')
    .get()
    .then(doc => console.log('doc', doc.data()))

  // TODO Getting the email of any doc should not be allowed

  // Add should not be allowed
  commitmentsRef
    .add({ name: 'Evil Doer' })
    .then(ref => { throw new Error('This should not succeed', ref) })
    .catch(err => { console.log('Write was prevented', err) });

  // Add and create a new collection should not be allowed

  return (
    <>
      <p>Testing</p>
    </>
  );
};

export default DBTestsPage;
