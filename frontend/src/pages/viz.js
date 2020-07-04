import React from 'react';

import Layout from '../components/layout';
import BubbleChartCanvas from '../components/visualization/BubbleChartCanvas';
import { generateData, createDataHierarchy } from '../components/visualization/helpers';

// TODO
// - [ ] Use real commitments data from server instead of dummy data

export default () => {
  const data = generateData(5000);

  // Choose the data hierarchy keys. TODO: Make this dynamic + UI-controllable
  const keys = ['country', 'postalCode', 'commitmentType'];
  // const keys = ['commitmentType', 'country'];
  //
  const dataHierarchy = createDataHierarchy(keys, data);

  return (
    <Layout>
      <h1>Hierarchical Data</h1>
      <BubbleChartCanvas data={dataHierarchy} />
    </Layout>
  );
};
