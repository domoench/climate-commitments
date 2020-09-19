import React, { useState } from 'react';
import SEO from '../components/seo';
import ProgressBar from 'react-bootstrap/ProgressBar';

import Layout from '../components/layout';
import stepComponents from '../commitment_components/stepComponents';

const Commitments = () => {
  const [step, setStep] = useState(0);
  const [error, toggleError] = useState(false);

  const [userState, setUserState] = useState({
    name: '',
    email: '',
    postalCode: '',
    country: '',
    commitments: {
      callRep: false,
      talk: false,
      join: false,
      divest: false,
      callBank: false,
    },
  });

  const showError = e => {
    toggleError(true);
  };

  const CurrentStepComponent = props => {
    const StepComponent = stepComponents[step];
    return <StepComponent {...props} />
  };

  // TODO Next steps
  // - Enable true form submission
  return (
    <Layout>
      <SEO title="Commitments" />

      <CurrentStepComponent
        step={step}
        setStep={setStep}
        userState={userState}
        setUserState={setUserState}
      />

      <div className="mt-4">
        <ProgressBar variant="secondary" now={step * 20} />
      </div>
    </Layout>
  );
};

export default Commitments;
