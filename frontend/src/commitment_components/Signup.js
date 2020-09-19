import React from 'react';
import Form from 'react-bootstrap/Form';
import { countries as countriesList } from 'countries-list';
import { Formik } from 'formik';

import StepNavigator from '../commitment_components/StepNavigator';

const countries = Object.values(countriesList).map(c => c.name);

const Signup = ({ step, setStep, userState, setUserState }) => {
  return (
    <>
      <div className="text-center">
        <h1>Your information</h1>
        <p>Now, enter your info so we can follow up with blah blabh blah.</p>
      </div>
      <Formik
        initialValues={{ name: userState.name }}
        validate={values => {
          console.log('TODO Validation', values);
        }}
        onSubmit={values => {
          console.log('TODO Submit Handler', values);
        }}
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
                />
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

export default Signup;
