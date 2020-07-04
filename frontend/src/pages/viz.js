import React from 'react';

import Layout from '../components/layout';
import BubbleChartCanvas from '../components/visualization/BubbleChartCanvas';
import { generateData, generateHierarchicalData, createDataHierarchy } from '../components/visualization/helpers';

// TODO
// - [ ] Use real commitments data from server instead of dummy data

export default () => {
  const data = generateData(700);
  // const keys = ['country', 'postalCode', 'commitmentType'];
  const keys = ['commitmentType', 'country'];
  const dataHierarchy = createDataHierarchy(keys, data);
  // const dataHierarchy = generateHierarchicalData();

  console.log('dataHierarchy', dataHierarchy);
  return (
    <Layout>
      <h1>Hierarchical Data</h1>
      <BubbleChartCanvas data={dataHierarchy} />
    </Layout>
  );
};
