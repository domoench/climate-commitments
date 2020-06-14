import React from "react"

import Button from "react-bootstrap/Button"

const Welcome = ({ currentStep, stepVal, onClick }) => {
  return currentStep !== stepVal ? null : (
    <div className="text-center">
      <h1>Take Climate Action</h1>
      <br />
      <p>
        Want to take action on climate change but don't know where to start?
        We've compiled 5 <b>meaningful</b> actions you can take alongside
        others. Start taking collective action now.
      </p>
      <Button className="mt-4" onClick={onClick}>
        {" "}
        Get started
      </Button>
    </div>
  )
}

export default Welcome
