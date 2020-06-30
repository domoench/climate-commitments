import React from 'react';

import Layout from '../components/layout';
import BubbleChartCanvas from '../components/visualization/BubbleChartCanvas';
import { generateFlatData } from '../components/visualization/helpers';

export default () => {
  return (
    <Layout>
      <h1>Flat Data</h1>
      <BubbleChartCanvas data={generateFlatData(3500)} />
    </Layout>
  );
};
