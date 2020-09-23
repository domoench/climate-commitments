import React from 'react';
import Button from 'react-bootstrap/Button';

import stepComponents from './stepComponents';

const canStepForward = step => step + 1 < stepComponents.length;
const canStepBackward = step => step - 1 >= 0;

export const PrevStep = ({ step, setStep }) => {
  const prevStep = e => {
    if (canStepBackward(step)) {
      setStep(step - 1);
    }
  };

  return (
    <Button
      onClick={prevStep}
      className="bg-primary"
      size="lg"
      disabled={!canStepBackward(step)}
    >
      Back
    </Button>
  );
};

export const NextStep = ({ step, setStep }) => {
  const nextStep = e => {
    if (canStepForward(step)) {
      setStep(step + 1);
    }
  };

  return (
    <Button
      onClick={nextStep}
      className="bg-primary"
      size="lg"
      disabled={!canStepForward(step)}
    >
      Next
    </Button>
  );
};

export const StepNavigatorWrapper = ({ children }) => (
  <div className="text-center mt-4">{children}</div>
);

export const BasicStepNavigator = ({ step, setStep }) => {
  return (
    <StepNavigatorWrapper>
      <PrevStep step={step} setStep={setStep} />
      <NextStep step={step} setStep={setStep} />
    </StepNavigatorWrapper>
  );
};
