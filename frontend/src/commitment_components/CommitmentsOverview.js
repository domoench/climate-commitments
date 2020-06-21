import React, { useState, useEffect } from "react"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"

import rep from "../images/rep.jpeg"

const CommitmentsOverview = ({ currentStep, stepVal, onClick }) => {
  const [commitments, setCommit] = useState([
    {
      action: "Call your representative",
      text:
        "National American leadership has failed to address the crisis. We must speak up and voice our views to public officials to ensure climate progress.",
      button: "CALL",
      commit: false,
    },
    {
      action: "Talk to three people",
      text:
        "Talking to people we know is the first step toward breaking the climate silence.",
      button: "TALK",
      commit: false,
    },
    {
      action: "Join a organization",
      text:
        " Through the hard work of organizations dedicated to climate and the environment, we can aggregate our efforts to make progress.",
      button: "JOIN",
      commit: false,
    },
    {
      action: "Encourage your employer to divest",
      text:
        "bloom psdopfasdjio asdf asdf asdf asdfasdf asdf asd ff oasid aiosioao aooas etlml asle oi",
      button: "DIVEST",
      commit: false,
    },
    {
      action: "Call your bank",
      text:
        "All the major consumer banks in the US are deeply involved in fossil fuel financing, including since Paris. If more consumers voice their opinions, large banks will change their behavior.",
      button: "BANK",
      commit: false,
    },
  ])

  const commitClick = e => {
    console.log(e.target.id)
    // console.log(commitments)
  }

  const [test, toggleTest] = useState("test")
  return currentStep !== stepVal ? null : (
    <div>
      <h1 className="text-primary text-center">Actions you can take:</h1>

      <br />
      {commitments.map(commitment => (
        <Row className="mt-3" key={commitment.button}>
          <Card style={{ maxWidth: "500px", margin: "auto" }}>
            <Card.Body>
              <Card.Title>{commitment.action}</Card.Title>

              <Card.Text
                style={{
                  fontFamily: "proxima_nova_light",
                }}
              >
                {commitment.text}
              </Card.Text>
              <div className="text-center">
                <Button
                  className={commitment.action ? "bg-primary" : "bg-secondary "}
                  id={commitment.button}
                  onClick={commitClick}
                  style={{
                    borderRadius: "500px",
                    height: "75px",
                    width: "75px",
                    padding: "0px",
                  }}
                >
                  {commitment.button}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Row>
      ))}
    </div>
  )
}

export default CommitmentsOverview
