import React, { useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Button from "react-bootstrap/Button"
import ProgressBar from "react-bootstrap/ProgressBar"

import Welcome from "../commitment_components/Welcome"
import CommitmentsOverview from "../commitment_components/CommitmentsOverview"
import Signup from "../commitment_components/Signup"
import NextSteps from "../commitment_components/NextSteps"

const Commitments = () => {
  const [step, setStep] = useState(0)
  const [error, toggleError] = useState(false)

  const [userState, setUserState] = useState({
    name: "",
    zip: "",
    email: "",
    commitments: {
      callRep: false,
      talk: false,
      join: false,
      divest: false,
      callBank: false,
    },
  })

  const showError = e => {
    toggleError(true)
  }

  const prevStep = e => {
    setStep(step - 1)
    toggleError(false)
  }
  const nextStep = e => {
    setStep(step + 1)
    toggleError(false)
  }

  return (
    <Layout>
      <SEO title="Commitments" />

      <Welcome stepVal={0} currentStep={step} onClick={nextStep} />
      <CommitmentsOverview
        stepVal={1}
        currentStep={step}
        onClick={nextStep}
        userState={userState}
        setUserState={setUserState}
      />
      <Signup stepVal={2} currentStep={step} onClick={nextStep} />
      <NextSteps
        stepVal={3}
        currentStep={step}
        onClick={nextStep}
        userState={userState}
      />

      <div className="text-center mt-4">
        <Button onClick={prevStep} variant="light" className="mr-4" size="lg">
          Back
        </Button>
        <Button onClick={nextStep} className="bg-primary" size="lg">
          Next
        </Button>
      </div>

      <div className="mt-4">
        <ProgressBar variant="secondary" now={step * 20} />
      </div>
    </Layout>
  )
}

export default Commitments
