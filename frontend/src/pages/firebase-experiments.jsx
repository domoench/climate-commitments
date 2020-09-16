import React, { useState } from 'react';
import Ajv from 'ajv';
import withFirebase from '../components/withFirebase';
import Schema from '../commitment.schema.json';
import { countries as countriesList } from 'countries-list';

var ajv = new Ajv();
var validate = ajv.compile(Schema);

const Display = ({ firebase }) => {
  const [aggregateData, setAggregateData] = useState({});

  const handleClick = () => {
    firebase
      .firestore()
      .collection('aggregate')
      .doc('all')
      .get()
      .then(doc => {
        setAggregateData(doc.data());
      })
      .catch(err => console.error(err));
  };

  return (
    <>
      <h2>Aggregated commitment data</h2>
      <div>
        <pre>{JSON.stringify(aggregateData, null, 2)}</pre>
      </div>
      <button onClick={handleClick}>Refresh Data</button>
    </>
  );
};

const FirebaseExperimentsPage = ({ firebase }) => {
  // User info
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // User commitments
  const [callBank, setCallBank] = useState(false);
  const [callRep, setCallRep] = useState(false);
  const [talk, setTalk] = useState(false);
  const [participate, setParticipate] = useState(false);
  const [divestment, setDivestment] = useState(false);

  const handleSubmit = event => {
    console.log('SUBMIT');
    event.preventDefault();

    const commitmentData = {
      name,
      email,
      postalCode,
      country,

      // Commitments
      commitments: {
        callBank,
        callRep,
        talk,
        participate,
        divestment,
      },
    };

    // TODO move validation into its own module
    // Static validation
    var valid = validate(commitmentData);
    console.log('validation: ', validate.errors);

    // Country validation
    const countries = Object.values(countriesList).map(c => c.name);
    console.log('countries', countries);
    if (countries.indexOf(commitmentData.country) === -1) {
      console.log('validation: bad country', commitmentData.country)
    }

    // TODO checkout https://www.npmjs.com/package/postal-codes-js for postal code validation


    // https://firebase.google.com/docs/functions/callable
    // TODO: Handle errors - e.g. submitting a commitment with the same email
    const createCommitment = firebase
      .functions()
      .httpsCallable('createCommitment');
    createCommitment(commitmentData)
      .then(result => console.log('created', result.data))
      .catch(err => console.error(err));
  };

  const labelStyle = {
    display: 'block',
  };

  return (
    <>
      <h2>Commitment Form</h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>
          <input
            name="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {` Name`}
        </label>

        <label style={labelStyle}>
          <input
            name="email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {` Email`}
        </label>

        <label style={labelStyle}>
          <input
            name="country"
            type="text"
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
          {` Country`}
        </label>

        <label style={labelStyle}>
          <input
            name="postalCode"
            type="text"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
          />
          {` Postal Code`}
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
