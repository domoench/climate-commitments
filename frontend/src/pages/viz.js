import React, { useState } from 'react';
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"

import Layout from '../components/layout';
import BubbleChartCanvas from '../components/visualization/BubbleChartCanvas';
import { generateData, createDataHierarchy } from '../components/visualization/helpers';

// TODO
// - [ ] Use real commitments data from server instead of dummy data

const HIERARCHY_KEYS = ['country', 'postalCode', 'commitmentType'];

const buttonStyle = {
  marginLeft: 4,
  marginRight: 4,
};

const rowStyle = {
  padding: '4px 0',
}

const HierarchyControls = ({ keys, toggleKey, shiftKeyUp, shiftKeyDown }) => {
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

export default () => {
  // keys is an ordered list of the hierarchy keys, and whether they are active or not
  const [keys, setKeys] = useState(HIERARCHY_KEYS.map(key => ({key: key, active: true})));

  const toggleKey = (key) => {
    setKeys(
      keys.map((keyObj) => {
        return (key === keyObj.key) ?
          {
            ...keyObj,
            active: !keyObj.active
          } :
          keyObj;
      })
    );
  };

  const shiftKeyUp = (key) => {
    const keyIdx = keys.map(k => k.key).findIndex(k => k === key); // Assume it is never -1
    const prevIdx = keyIdx - 1;
    if (keyIdx >= 0) {
      const newKeys = keys.map(k => k);
      const tmp = newKeys[keyIdx];
      newKeys[keyIdx] = newKeys[prevIdx];
      newKeys[prevIdx] = tmp;
      setKeys(newKeys);
    }
  }

  const shiftKeyDown = (key) => {
    const keyIdx = keys.map(k => k.key).findIndex(k => k === key); // Assume it is never -1
    const nextIdx = keyIdx + 1;
    if (keyIdx < keys.length) {
      const newKeys = keys.map(k => k);
      const tmp = newKeys[keyIdx];
      newKeys[keyIdx] = newKeys[nextIdx];
      newKeys[nextIdx] = tmp;
      setKeys(newKeys);
    }
  }

  // const keys = ['country', 'postalCode', 'commitmentType'];
  // const keys = ['commitmentType', 'country'];
  /*
  const remainingKeys = HIERARCHY_KEYS.filter(key => keys.indexOf(key) === -1)

  const addKey = (key) => {
    if (HIERARCHY_KEYS.indexOf(key) !== -1) {
      setKeys([...keys, key]);
    }
  }
  */

  const data = generateData(5000);
  const activeKeys = keys.filter(k => k.active).map(k => k.key);
  const dataHierarchy = createDataHierarchy(activeKeys, data);

  return (
    <Layout>
      <h1>Hierarchical Data</h1>

      <HierarchyControls
        keys={keys}
        toggleKey={toggleKey}
        shiftKeyUp={shiftKeyUp}
        shiftKeyDown={shiftKeyDown}
      />
      <BubbleChartCanvas data={dataHierarchy} />
    </Layout>
  );
};
