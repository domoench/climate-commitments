import React from 'react';

const ReviewSubmission = ({ step, setStep, userState }) => {
  return  (
    <>
      <h1>Your Submission</h1>
      <pre>{JSON.stringify(userState, null, 2)}</pre>
    </>
  );
};

export default ReviewSubmission;

