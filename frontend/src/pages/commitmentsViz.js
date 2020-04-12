import React from 'react';

import Layout from '../components/layout';
import PackedCircles from '../components/visualization/PackedCircles';
import BubbleChart from '../components/visualization/BubbleChart';

// TODO
// - [X] Basic circle packing visualization
// - [ ] Display labels
// - Dynamically aggregate commitments at higher zoom levels, and render more granualar when zoomed in
// - [ ] Dynamically set the visualization dimensions based on screen dimensions
// - [ ] Use real commitments data from server instead of dummy data

// Interesting d3 examples
//  - Position transition animations: https://jsfiddle.net/VividD/WDCpq/8/
//  - Canvas packed circles with additional detail rendering on zoom:
//    - Overview: https://gist.github.com/nbremer/667e4df76848e72f250b
//    - Demo: https://nbremer.github.io/occupationscanvas/

export default () => {
  return (
    <Layout>
      <PackedCircles />
      <BubbleChart />
    </Layout>
  );
}
