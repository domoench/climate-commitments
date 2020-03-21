import React, { useEffect, useState } from 'react';
import axios from 'axios';
import withFirebase from '../components/withFirebase';

// TODO Read and understand setting up react for multiple envs
// https://daveceddia.com/multiple-environments-with-react/

// PROB: Aggregate doc exists but we're not able to fetch via SDK
//   - Exists: http://localhost:8080/v1/projects/climate-commitments-staging/databases/(default)/documents/aggregate/countsByZip
//   - Fetching via db.collection('aggregate').doc('countsByZip').get() ain't workin
//     - Confirmed the port is properly set to 8080 for local dev

const Display = ({ firebase }) => {
  const handleClick = () => {
    // CANNOT get the firebase SDK to succeed, going to the HTTPS API
    // const endpoint = 'http://localhost:8080/v1/projects/climate-commitments-staging/databases/(default)/documents/commitments'
    const endpoint = 'http://localhost:8080/v1/projects/climate-commitments-staging/databases/(default)/documents/aggregate/countsByZip'
    axios.get(endpoint)
      .then(response => console.log(response.data.fields))
      .catch(error => console.error(`${error}`));
  }

  return (
    <>
      <button onClick={handleClick}>
        Inspect
      </button>
    </>
  );
}

const DBTestsPage = ({ firebase }) => {
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

    /*
    const endpoint = 'http://localhost:5001/climate-commitments-staging/us-central1/createCommitment'
    // const endpoint = `${cloudFunctionsEndpoint()}/createCommitment`;
    // const endpoint = `/createCommitment`
    console.log('commitmentData', commitmentData);
    console.log('endpoint', endpoint);
    axios.post(endpoint, commitmentData)
      .then(response => console.log(response))
      .catch(error => console.error(`${error}`));
    */
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

export default withFirebase(DBTestsPage);
