import React from 'react';
import Button from 'react-bootstrap/Button';

import stepComponents from './stepComponents';

const StepNavigator = ({ step, setStep, beforeNext }) => {

  const prevStep = e => {
    if (step - 1 >= 0) {
      setStep(step - 1);
    }
  };

  const nextStep = e => {
    if (beforeNext) {
      beforeNext();
    }

    if (step + 1 < stepComponents.length) {
      console.log(`step:${step}. going to:${step+1}`);
      setStep(step + 1);
    }
  };

  return (
    <div className="text-center mt-4">
      <Button onClick={prevStep} variant="light" className="mr-4" size="lg">
        Back
      </Button>
      <Button onClick={nextStep} className="bg-primary" size="lg">
        Next
      </Button>
    </div>
  );
};

export default StepNavigator;
