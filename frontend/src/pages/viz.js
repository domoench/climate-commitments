import React from 'react';

import Layout from '../components/layout';
import BubbleChartCanvas from '../components/visualization/BubbleChartCanvas';
import { generateHierarchicalData } from '../components/visualization/helpers';

// TODO
// - [ ] Use real commitments data from server instead of dummy data

export default () => {
  return (
    <Layout>
      <h1>Hierarchical Data</h1>
      <BubbleChartCanvas data={generateHierarchicalData()} />
    </Layout>
  );
};
