import React, { useState } from 'react';
import SEO from '../components/seo';
import ProgressBar from 'react-bootstrap/ProgressBar';

import Layout from '../components/layout';
import stepComponents from '../commitment_components/stepComponents';
import { COMMITMENT_TYPES } from '../commitments';

const Commitments = () => {
  const [step, setStep] = useState(0);
  const [error, toggleError] = useState(false);

  const initialCommitmentState = Object.keys(COMMITMENT_TYPES).reduce(
    (accum, commitmentKey) => ({
      ...accum,
      [commitmentKey]: false,
    }),
    {}
  );

  const [userState, setUserState] = useState({
    name: '',
    email: '',
    postalCode: '',
    country: 'United States',
    commitments: initialCommitmentState,
  });

  const showError = e => {
    toggleError(true);
  };

  const CurrentStepComponent = props => {
    const StepComponent = stepComponents[step];
    return <StepComponent {...props} />;
  };

  return (
    <Layout>
      <SEO title="Commitments" />

      <div className="mt-4">
        <ProgressBar
          variant="secondary"
          now={(step * 100) / (stepComponents.length - 1)}
        />
      </div>

      <CurrentStepComponent
        step={step}
        setStep={setStep}
        userState={userState}
        setUserState={setUserState}
      />
    </Layout>
  );
};

export default Commitments;
