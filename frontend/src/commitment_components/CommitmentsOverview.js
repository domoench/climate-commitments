import React from "react"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"

const CommitmentsOverview = ({ currentStep, stepVal, onClick }) => {
  return currentStep !== stepVal ? null : (
    <div>
      <h1 className="text-primary text-center">Actions you can take:</h1>

      <br />
      <Card>
        <Card.Body>
          <Card.Title>
            <div className="text-left">
              {" "}
              <Form.Check type="checkbox" label="Call your representative" />
            </div>
          </Card.Title>
          <Card.Text>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati
            doloribus dolorem explicabo qui voluptate recusandae sit, voluptatum
            nemo placeat consequatur accusantium similique! Nihil esse
            reprehenderit corporis qui. Earum, omnis quidem.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default CommitmentsOverview
