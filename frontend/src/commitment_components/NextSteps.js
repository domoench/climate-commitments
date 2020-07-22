import React from "react"
import Form from "react-bootstrap/Form"
import Card from "react-bootstrap/Card"
import Row from "react-bootstrap/Row"
import Button from "react-bootstrap/Button"
import commitments from "./commitments"
import Badge from "react-bootstrap/Badge"
import { Link } from "gatsby"

const NextSteps = ({ currentStep, stepVal, onClick, userState }) => {
  return currentStep !== stepVal ? null : (
    <>
      <div className="text-center">
        <h1>Take the next steps</h1>
        <p>Check your email for more information.</p>
      </div>
      {commitments.map(commitment =>
        userState.commitments[commitment.id] ? (
          <Row className="mt-3" key={commitment.button}>
            <Card style={{ minWidth: "250px", margin: "auto" }}>
              <Card.Body>
                <Card.Title>{commitment.action} </Card.Title>{" "}
                <Card.Text
                  style={{
                    fontFamily: "proxima_nova_light",
                  }}
                >
                  <Link to={commitment.id}>More info</Link>
                  {/* A badge that pops up when you commit */}
                  <div class="mt-3">
                    {userState.commitments[commitment.id] ? (
                      <Badge variant="light">
                        Committed <span>🎉 </span>
                      </Badge>
                    ) : null}
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Row>
        ) : null
      )}
    </>
  )
}

export default NextSteps
