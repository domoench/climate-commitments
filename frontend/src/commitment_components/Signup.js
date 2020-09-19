import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { countries as countriesList } from 'countries-list';
import StepNavigator from '../commitment_components/StepNavigator';

const countries = Object.values(countriesList).map(c => c.name);

const Signup = ({ step, setStep, userState, setUserState }) => {
  // TODO try giving form its own state so it doesn't re-render upon every userState change
  //
  // Yes it works. Problem is trying to have the app userState be live updated as the form state
  // changes. The unintended consequence of that is repeated re-renders of the form component, which
  // leads to loss of focus on input fields.
  // By creating independent form state here we fix that problem. Having duplicated form state is
  // a necessary complication here.
  //
  // Next up try out Formik to manage separate form state along with validation + other niceties without
  // rolling my own solution.
  const [formState, setFormState] = useState(userState);
  console.log('formState', formState);

  const textChangeHandler = fieldName => event => {
    setFormState({
      ...setFormState,
      [fieldName]: event.target.value,
    });
  };

  const handleSubmit = () => {
    console.log('SUBMIT', formState);
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
            value={formState.name}
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
            value={formState.postalCode}
            onChange={textChangeHandler('postalCode')}
            placeholder="Postal Code"
          />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            as="input"
            type="text"
            value={formState.email}
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
