import React from 'react';

const ReviewSubmission = ({ step, setStep, userState }) => {
  return  (
    <>
      <h1>Your Submission</h1>
      <span>{JSON.stringify(userState)}</span>
    </>
  );
};

export default ReviewSubmission;

