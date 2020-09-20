import React from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import stepComponents from './stepComponents';

const StepNavigator = ({ step, setStep, beforeNext, nextLoading }) => {
  const canStepForward = step + 1 < stepComponents.length;
  const canStepBackward = step - 1 >= 0;

  const prevStep = e => {
    if (canStepBackward) {
      setStep(step - 1);
    }
  };

  const nextStep = async e => {
    // Continue to the next step
    // If there is a beforeNext async function defined, execute that first
    // and only proceed to the next step if it resolves.
    // TODO: Why is this working when an empty form is submitted, shouldn't validation
    // complain about blank email?
    const func = beforeNext ? beforeNext : () => Promise.resolve();
    const promise = func();
    promise.then(result => {
      console.log('A', result);
      if (canStepForward) {
        setStep(step + 1);
      }
    })
    .catch(err => {
      console.log('B', err);
    });
  };

  console.log('StepNavigator render(). nextLoading', nextLoading);
  return (
    <div className="text-center mt-4">
      <Button
        onClick={prevStep}
        variant="light"
        className="mr-4"
        size="lg"
        disabled={!canStepBackward}
      >
        Back
      </Button>
      <Button
        onClick={nextStep}
        className="bg-primary"
        size="lg"
        disabled={!canStepForward || nextLoading}
      >
        {nextLoading && (
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
    </div>
  );
};

export default StepNavigator;
