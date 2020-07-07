import React from "react"
import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"

const Signup = ({ currentStep, stepVal, onClick }) => {
  return currentStep !== stepVal ? null : (
    <Form>
      <div className="text-center">
        <h1>Your information</h1>
        <p>Now, enter your info so we can follow up with blah blabh blah.</p>
      </div>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter email" />
      </Form.Group>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Zip Code</Form.Label>
        <Form.Control type="zip" placeholder="Zip code" />
      </Form.Group>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>
    </Form>
  )
}

export default Signup
