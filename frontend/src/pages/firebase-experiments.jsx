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
  // User info
  const [zip, setZip] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // User commitments
  const [callBank, setCallBank] = useState(false);
  const [callRep, setCallRep] = useState(false);
  const [talk, setTalk] = useState(false);
  const [participate, setParticipate] = useState(false);
  const [divestment, setDivestment] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const commitmentData = {
      name,
      email,
      zip,

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
    // TODO: Handle errors - e.g. submitting a commitment with the same email
    const createCommitment = firebase.functions().httpsCallable('createCommitment');
    createCommitment(commitmentData)
      .then(result => console.log('created', result.data))
      .catch(err => console.error(err));
  }

  const labelStyle = {
    display: 'block',
  }

  return (
    <>
      <h2>Commitment Form</h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>
          <input
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {` Name`}
        </label>

        <label style={labelStyle}>
          <input
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {` Email`}
        </label>

        <label style={labelStyle}>
          <input
            name="zip"
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
          {` Zipcode`}
        </label>

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
        <input type="submit" value="Submit" />
      </form>
      <Display firebase={firebase} />
    </>
  );
};

export default withFirebase(FirebaseExperimentsPage);
