import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';

import Layout from '../components/layout';
import PackedCirclesCanvas from '../components/visualization/PackedCirclesCanvas';
import {
  generateData,
  createDataHierarchy,
} from '../components/visualization/helpers/data';
import {
  HIERARCHY_KEYS,
  HierarchyControls,
} from '../components/visualization/HierarchyControls';
import withFirebase from '../components/withFirebase';

// TODO
// - [ ] Use real commitments data from server instead of dummy data

const VizPage = ({ firebase }) => {
  const [commitmentsData, setCommitmentsData] = useState([]);
  // keys is an ordered list of the hierarchy keys, and whether they are active or not
  const [keys, setKeys] = useState(
    HIERARCHY_KEYS.map(key => ({ key: key, active: true }))
  );
  const [useFakeData, setUseFakeData] = useState(false);

  const toggleKey = key => {
    setKeys(
      keys.map(keyObj => {
        return key === keyObj.key
          ? {
              ...keyObj,
              active: !keyObj.active,
            }
          : keyObj;
      })
    );
  };

  const shiftKeyUp = key => {
    const keyIdx = keys.map(k => k.key).findIndex(k => k === key); // Assume it is never -1
    const prevIdx = keyIdx - 1;
    if (prevIdx >= 0) {
      const newKeys = keys.map(k => k);
      const tmp = newKeys[keyIdx];
      newKeys[keyIdx] = newKeys[prevIdx];
      newKeys[prevIdx] = tmp;
      setKeys(newKeys);
    }
  };

  const shiftKeyDown = key => {
    const keyIdx = keys.map(k => k.key).findIndex(k => k === key); // Assume it is never -1
    const nextIdx = keyIdx + 1;
    if (nextIdx < keys.length) {
      const newKeys = keys.map(k => k);
      const tmp = newKeys[keyIdx];
      newKeys[keyIdx] = newKeys[nextIdx];
      newKeys[nextIdx] = tmp;
      setKeys(newKeys);
    }
  };

  const fetchCommitments = () => {
    firebase
      .firestore()
      .collection('aggregate')
      .doc('all')
      .get()
      .then(doc => {
        setCommitmentsData(doc.data().commitments);
      })
      .catch(err => console.error(err));
  };

  useEffect(fetchCommitments, []);

  const data = useFakeData ? generateData(2000) : commitmentsData;
  const activeKeys = keys.filter(k => k.active).map(k => k.key);
  const dataHierarchy = createDataHierarchy(activeKeys, data);

  return (
    <Layout>
      <h1>Commitments Visualization</h1>

      <h2>Toggle Fake Data</h2>
      <Button
        size="sm"
        onClick={() => setUseFakeData(!useFakeData)}
      >
        Toggle
      </Button>

      <h2>Hierarchy Controls</h2>
      <HierarchyControls
        keys={keys}
        toggleKey={toggleKey}
        shiftKeyUp={shiftKeyUp}
        shiftKeyDown={shiftKeyDown}
      />
      <PackedCirclesCanvas data={dataHierarchy} />
    </Layout>
  );
};

export default withFirebase(VizPage);
