import React from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { countries as countriesList } from 'countries-list';
import StepNavigator from '../commitment_components/StepNavigator';

const countries = Object.values(countriesList).map(c => c.name);

const Signup = ({ step, setStep, userState, setUserState }) => {
  const textChangeHandler = fieldName => event => {
    setUserState({
      ...userState,
      [fieldName]: event.target.value,
    });
  };

  const handleSubmit = () => {
    console.log('SUBMIT', userState);
  }

  return (
    <>
      <Form>
        <div className="text-center">
          <h1>Your information</h1>
          <p>Now, enter your info so we can follow up with blah blabh blah.</p>
        </div>

        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            as="input"
            type="text"
            value={userState.name}
            onChange={textChangeHandler('name')}
            placeholder="Name"
          />
          <Form.Text muted>
            Leave blank to appear as 'Anonymous' on the public commitments
            visualization.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicCountry">
          <Form.Label>Country</Form.Label>
          <Form.Control as="select" placeholder="Country">
            {countries.map(country => (
              <option key={country}>{country}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formBasicPostalCode">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            as="input"
            type="text"
            value={userState.postalCode}
            onChange={textChangeHandler('postalCode')}
            placeholder="Postal Code"
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            as="input"
            type="text"
            value={userState.email}
            onChange={textChangeHandler('email')}
            placeholder="Enter email"
          />
        </Form.Group>
      </Form>
      <StepNavigator step={step} setStep={setStep} beforeNext={handleSubmit}/>
    </>
  );
};

export default Signup;
