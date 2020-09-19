import React from 'react';
import Form from 'react-bootstrap/Form';
import { countries as countriesList } from 'countries-list';
import { Formik } from 'formik';

import { validate } from '../validation';
import StepNavigator from '../commitment_components/StepNavigator';
import withFirebase from '../components/withFirebase';

const countries = Object.values(countriesList).map(c => c.name);

// TODO submit state loading wheel

const validateForm = values => {
  // The validation module is stricter than we need to be. Only
  // prevent submission on certain validation errors.
  const strictFields = ['email'];
  const strictErrors = validate(values);

  const filteredErrors = {};
  Object.entries(strictErrors).forEach(([field, error]) => {
    if (strictFields.indexOf(field) !== -1) {
      filteredErrors[field] = error;
    }
  });
  return filteredErrors;
};

const Signup = ({ firebase, step, setStep, userState, setUserState }) => {
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('TODO Submit Handler', values);
    const { name, email, postalCode, country } = values;
    const { callBank, callRep, talk, participate, divestment } = userState;

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

    console.log('VALIDATING. frontend errors: ', validate(commitmentData));

    // https://firebase.google.com/docs/functions/callable
    const createCommitment = firebase
      .functions()
      .httpsCallable('createCommitment');
    createCommitment(commitmentData)
      .then(result => {
        console.log('Successful submission', result.data)
        // TODO set userState to commitmentData
      })
      .catch(err => {
        // TODO surface server error in UI
        console.error('Error code: ', err.code);
        console.error(err);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <>
      <div className="text-center">
        <h1>Your information</h1>
        <p>Now, enter your info so we can follow up with blah blabh blah.</p>
      </div>
      <Formik
        initialValues={{
          name: userState.name,
          country: userState.country,
          postalCode: userState.postalCode,
          email: userState.email,
        }}
        validate={validateForm}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <>
            {isSubmitting && <span>SUBMITTINGGGG TODO</span>}
            <Form>
              <Form.Group controlId="validationFormikName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={values.name}
                  onChange={handleChange}
                />
                <Form.Text muted>
                  Leave blank to appear as 'Anonymous' on the public commitments
                  visualization.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="validationFormikCountry">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  as="select"
                  name="country"
                  placeholder="Country"
                  value={values.country}
                  onChange={handleChange}
                >
                  {countries.map(country => (
                    <option key={country}>{country}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="validationFormikPostalCode">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={values.postalCode}
                  onChange={handleChange}
                  isInvalid={!!errors.postalCode}
                />
              </Form.Group>

              <Form.Group controlId="validationFormikEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  Check your email format.
                </Form.Control.Feedback>
              </Form.Group>
            </Form>

            <StepNavigator
              step={step}
              setStep={setStep}
              beforeNext={handleSubmit}
            />
          </>
        )}
      </Formik>
    </>
  );
};

export default withFirebase(Signup);
