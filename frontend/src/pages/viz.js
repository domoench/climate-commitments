import React, { useState } from 'react';

import Layout from '../components/layout';
import BubbleChartCanvas from '../components/visualization/BubbleChartCanvas';
import { generateData, createDataHierarchy } from '../components/visualization/helpers';

// TODO
// - [ ] Use real commitments data from server instead of dummy data

const HIERARCHY_KEYS = ['country', 'postalCode', 'commitmentType'];

const HierarchyControls = ({ keys, toggleKey, shiftKeyUp, shiftKeyDown }) => {
  return (
    <ul>
      {keys.map(keyObj =>
        <div key={keyObj.key}>
          {keyObj.key}
          <button onClick={() => toggleKey(keyObj.key)}>
            {keyObj.active ? 'Off' : 'On'}
          </button>
          <button onClick={() => shiftKeyUp(keyObj.key)}>
            Up
          </button>
          <button onClick={() => shiftKeyDown(keyObj.key)}>
            Down
          </button>
        </div>
      )}
    </ul>
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
