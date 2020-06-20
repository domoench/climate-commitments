import React from 'react';

import Layout from '../components/layout';
import BubbleChartCanvas from '../components/visualization/BubbleChartCanvas';

export default () => {
  return (
    <Layout>
      <h1>Flat Data</h1>
      <BubbleChartCanvas flat />
    </Layout>
  );
};
