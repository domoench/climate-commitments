import React, { useEffect, useState } from 'react';
import firebase from 'gatsby-plugin-firebase';

const runFirebaseCalls = () => {
  // Get the collection
  // TODO forbid this
  const commitmentsRef = firebase
    .firestore()
    .collection('commitments');
  commitmentsRef
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        console.log('collection -> doc', doc.data());
      })
    })
    .catch(err => { throw new Error(`You messed up: ${err}`) });

  // Get a single doc
  // TODO forbid this, except the aggregate doc
  commitmentsRef
    .doc('mj9bTP36vnU8qB5lnJO9')
    .get()
    .then(doc => console.log('doc', doc.data()))

  // TODO Getting the email of any doc should not be allowed

  // Add should not be allowed
  commitmentsRef
    .add({ name: 'Evil Doer' })
    .then(ref => { throw new Error('This should not succeed', ref) })
    .catch(err => { console.log(`Write was prevented ${err}`) });

  // TODO and create a new collection should not be allowed
};

const DBTestsPage = () => {
  const [zip, setZip] = useState('');
  const [callBank, setCallBank] = useState(false);
  const [callRep, setCallRep] = useState(false);
  const [talk, setTalk] = useState(false);
  const [participate, setParticipate] = useState(false);
  const [divestment, setDivestment] = useState(false);

  useEffect(() => {
    // runFirebaseCalls();
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    // TODO how to enforce unique emails in the commitments docs
    const commitmentData = {
      name: 'tester',
      email: 'test@test.com',
      zip,

      // Commitments
      callBank,
      callRep,
      talk,
      participate,
      divestment,
    };

    console.log('commitmentData', commitmentData);
  }

  const handleZipChange = (event) => setZip(event.target.value);

  const labelStyle = {
    display: 'block',
  }

  return (
    <form onSubmit={handleSubmit}>
      <label style={labelStyle}>
        <input
          name="callBank"
          type="checkbox"
          checked={callBank}
          onChange={() => setCallBank(!callBank)}
        />
        {` Call your bank`}
      </label>

      <label style={labelStyle}>
        <input
          name="callRep"
          type="checkbox"
          checked={callRep}
          onChange={() => setCallRep(!callRep)}
        />
        {` Call your elected representative`}
      </label>

      <label style={labelStyle}>
        <input
          name="talk"
          type="checkbox"
          checked={talk}
          onChange={() => setTalk(!talk)}
        />
        {` Talk to 3 people`}
      </label>

      <label style={labelStyle}>
        <input
          name="participate"
          type="checkbox"
          checked={participate}
          onChange={() => setParticipate(!participate)}
        />
        {` Participate in a climate organization`}
      </label>

      <label style={labelStyle}>
        <input
          name="divestment"
          type="checkbox"
          checked={divestment}
          onChange={() => setDivestment(!divestment)}
        />
        {` Encourage divestment`}
      </label>

      <label style={labelStyle}>
        <input
          name="zip"
          type="text"
          value={zip}
          onChange={handleZipChange}
        />
        {` Zipcode`}
      </label>

      <input type="submit" value="Submit" />
    </form>
  );
};

export default DBTestsPage;
