import React from 'react';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { countries as countriesList } from 'countries-list';
import { Formik } from 'formik';

import { validate } from '../validation';
import {
  StepNavigatorWrapper,
  PrevStep,
} from '../commitment_components/StepNavigator';
import withFirebase from '../components/withFirebase';

const countries = Object.values(countriesList).map(c => c.name);

const Signup = ({ firebase, step, setStep, userState, setUserState }) => {
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

  const submitCommitment = (values, { setSubmitting, setStatus }) => {
    setStatus(null);
    const { name, email, postalCode, country } = values;
    const {
      callBank,
      callRep,
      talk,
      participate,
      divestment,
    } = userState.commitments;

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

    // https://firebase.google.com/docs/functions/callable
    const createCommitment = firebase
      .functions()
      .httpsCallable('createCommitment');

    return createCommitment(commitmentData)
      .then(result => {
        setUserState({
          ...userState,
          name,
          email,
          postalCode,
          country,
        });
        setSubmitting(false);
        setStep(step + 1);
      })
      .catch(err => {
        setStatus(`Problem submitting: ${err}`);
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
        onSubmit={submitCommitment}
      >
        {({
          values,
          errors,
          status,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <>
            {status && <Alert variant="warning">{status}</Alert>}
            <Form onSubmit={handleSubmit}>
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
              <StepNavigatorWrapper>
                <PrevStep step={step} setStep={setStep} />
                <Button
                  type="submit"
                  className="bg-primary"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                  Next
                </Button>
              </StepNavigatorWrapper>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default withFirebase(Signup);
