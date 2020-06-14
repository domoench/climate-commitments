import React from "react"

import Button from "react-bootstrap/Button"

const Welcome = ({ currentStep, stepVal, onClick }) => {
  return currentStep !== stepVal ? null : (
    <div className="text-center">
      <h1>The Climate Museum</h1>
      <h2 className="lead">
        Welcome to Climate Commitments. The first The first museum in the U.S.
        dedicated to the climate crisis.
      </h2>
      <Button className="mt-4" onClick={onClick}>
        {" "}
        Get started
      </Button>
    </div>
  )
}

export default Welcome
