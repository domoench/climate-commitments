import React from 'react';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { countries as countriesList } from 'countries-list';
import { Formik } from 'formik';

import { validate } from '../validation';
import StepNavigator from '../commitment_components/StepNavigator';
import withFirebase from '../components/withFirebase';

const countries = Object.values(countriesList).map(c => c.name);

const Signup = ({ firebase, step, setStep, userState, setUserState }) => {
  const validateForm = values => {
    console.log('validating form');
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

    /*
    if (Object.keys(filteredErrors).length !== 0) {
      return Promise.reject(filteredErrors);
    }
    return Promise.resolve({})
    */
    return Promise.resolve(filteredError)
  };

  const handleSubmit = (values, { setSubmitting, setStatus }) => {
    console.log('TODO Submit Handler', values);
    setStatus(null);
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

    // https://firebase.google.com/docs/functions/callable
    const createCommitment = firebase
      .functions()
      .httpsCallable('createCommitment');

    return createCommitment(commitmentData)
      .then(result => {
        console.log('handleSubmit.then(). Successful submission', result.data);
        setSubmitting(false);
        // TODO set userState to commitmentData
        return result;
      })
      .catch(err => {
        console.error('handleSubmit.catch(). Submission error: ', err);
        setStatus(`Problem submitting: ${err}`);

        throw err;
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
          status,
          touched,
          handleChange,
          handleBlur,
          submitForm,
          isSubmitting,
        }) => console.log(`Form render(). isSubmitting:${isSubmitting}`) || (
          <>
            {status && <Alert variant="warning">{status}</Alert>}
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
              beforeNext={submitForm}
              nextLoading={isSubmitting}
            />
          </>
        )}
      </Formik>
    </>
  );
};

export default withFirebase(Signup);
