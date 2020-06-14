import React, { useState } from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Button from "react-bootstrap/Button"

import Welcome from "../commitment_components/Welcome"
const Commitments = () => {
  const [step, setStep] = useState(0)
  const [error, toggleError] = useState(false)

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
      {step}
      <Welcome stepVal={0} currentStep={step} onClick={nextStep} />
    </Layout>
  )
}

export default Commitments
