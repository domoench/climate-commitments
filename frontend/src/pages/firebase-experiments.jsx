import React, { useState } from 'react';
import withFirebase from '../components/withFirebase';

const Display = ({ firebase }) => {
  const [counts, setCounts] = useState({})

  const handleClick = () => {
    firebase.firestore().collection('aggregate').doc('countsByZip').get()
      .then((doc) => {
        setCounts(doc.data())
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <h2>Aggregated commitment counts by zip</h2>
      <div><pre>{JSON.stringify(counts, null, 2) }</pre></div>
      <button onClick={handleClick}>
        Refresh Counts
      </button>
    </>
  );
}

const FirebaseExperimentsPage = ({ firebase }) => {
  const [zip, setZip] = useState('');
  const [callBank, setCallBank] = useState(false);
  const [callRep, setCallRep] = useState(false);
  const [talk, setTalk] = useState(false);
  const [participate, setParticipate] = useState(false);
  const [divestment, setDivestment] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // TODO how to enforce unique emails in the commitments docs
    // TODO increment commitment
    const commitmentData = {
      name: 'tester',
      email: 'test@test.com',
      zip,
      // TODO timestamp

      // Commitments
      commitments: {
        callBank,
        callRep,
        talk,
        participate,
        divestment,
      }
    };

    // https://firebase.google.com/docs/functions/callable
    const createCommitment = firebase.functions().httpsCallable('createCommitment');
    createCommitment(commitmentData)
      .then(result => console.log('created', result.data))
      .catch(err => console.error(err));
  }

  const handleZipChange = (event) => setZip(event.target.value);

  const labelStyle = {
    display: 'block',
  }

  return (
    <>
      <h2>Commitment Form</h2>
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
      <Display firebase={firebase} />
    </>
  );
};

export default withFirebase(FirebaseExperimentsPage);
