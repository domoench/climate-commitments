import React from 'react';
import { BasicStepNavigator } from '../commitment_components/StepNavigator';

const Welcome = ({ step, setStep }) => {
  return  (
    <>
      <div className="text-center">
        <h1 className="text-primary">Collective Action for Climate Progress</h1>
        <br />
        <p className="lead">
          Want to take action on climate change but don't know where to start?
          We've compiled 5 <b>meaningful</b> actions you can take alongside
          others. Start taking collective action now.
        </p>
      </div>
      <BasicStepNavigator step={step} setStep={setStep} />
    </>
  );
};

export default Welcome;
