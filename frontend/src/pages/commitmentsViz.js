import React, { useState, useEffect } from 'react';
import { select, event } from 'd3-selection';
import { pack, hierarchy } from 'd3-hierarchy';
import { zoom } from 'd3-zoom';

import Layout from '../components/layout';
import PackedCircles from '../components/visualization/PackedCircles';
import BubbleChart from '../components/visualization/BubbleChart';

// TODO
// - [X] Basic circle packing visualization
// - [ ] Display labels
// - [ ] Dynamically set the visualization dimensions based on screen dimensions
// - [ ] Use real commitments data from server instead of dummy data

export default () => {
  return (
    <Layout>
      <PackedCircles />
      <BubbleChart />
    </Layout>
  );
}
