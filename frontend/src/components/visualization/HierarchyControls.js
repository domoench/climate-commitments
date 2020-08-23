import React from 'react';
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"

export const HIERARCHY_KEYS = ['country', 'postalCode', 'commitmentType'];

const buttonStyle = {
  marginLeft: 4,
  marginRight: 4,
};

const rowStyle = {
  padding: '4px 0',
}

export const HierarchyControls = ({ keys, toggleKey, shiftKeyUp, shiftKeyDown }) => {
  return (
    <Container>
      {keys.map((keyObj, i) =>
        <Row
          style={rowStyle}
          key={keyObj.key}
        >
          <Col>
            {`${i + 1})`} {keyObj.key}
          </Col>
          <Col xs={8}>
            <Button
              size='sm'
              style={buttonStyle}
              variant={keyObj.active ? 'success' : 'danger'}
              onClick={() => toggleKey(keyObj.key)}
            >
              {keyObj.active ? 'On' : 'Off'}
            </Button>
            <Button
              size='sm'
              style={buttonStyle}
              onClick={() => shiftKeyUp(keyObj.key)}
            >
              Up
            </Button>
            <Button
              size='sm'
              style={buttonStyle}
              onClick={() => shiftKeyDown(keyObj.key)}
            >
              Down
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
}
