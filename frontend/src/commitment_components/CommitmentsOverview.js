import React, { useState, useEffect } from "react"

import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Badge from "react-bootstrap/Badge"
import rep from "../images/rep.jpeg"
import commitments from "./commitments"

const CommitmentsOverview = ({
  currentStep,
  stepVal,
  setUserState,
  userState,
}) => {
  const commitClick = id => {
    console.log(`clicked ${id}`)
    console.log(userState.commitments[id])
    setUserState({
      ...userState,
      commitments: {
        ...userState.commitments,
        [id]: !userState.commitments[id],
      },
    })
  }

  return currentStep !== stepVal ? null : (
    <div>
      <h1 className="text-primary text-center">Actions you can take:</h1>

      <br />
      {commitments.map(commitment => (
        <Row className="mt-3" key={commitment.button}>
          <Card style={{ maxWidth: "500px", margin: "auto" }}>
            <Card.Body>
              <Card.Title>{commitment.action} </Card.Title>{" "}
              <Card.Text
                style={{
                  fontFamily: "proxima_nova_light",
                }}
              >
                {commitment.text}
              </Card.Text>
              <div className="text-center">
                <Button
                  className={
                    userState.commitments[commitment.id]
                      ? "bg-success"
                      : "bg-primary "
                  }
                  id={commitment.button}
                  onClick={e => commitClick(commitment.id)}
                  style={{
                    borderRadius: "500px",
                    height: "75px",
                    width: "75px",
                    padding: "0px",
                  }}
                >
                  {commitment.button}
                </Button>
                {/* A badge that pops up when you commit */}
                <div class="mt-3">
                  {userState.commitments[commitment.id] ? (
                    <Badge variant="light">
                      Committed <span>🎉 </span>
                    </Badge>
                  ) : null}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Row>
      ))}
    </div>
  )
}

export default CommitmentsOverview
