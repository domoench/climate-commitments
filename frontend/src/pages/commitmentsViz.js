import React from 'react';

import Layout from '../components/layout';
// import PackedCirclesSVG, PackedCirclesCanvas from '../components/visualization/PackedCircles';
import BubbleChartSVG from '../components/visualization/BubbleChart';
import BubbleChartCanvas from '../components/visualization/BubbleChartCanvas';

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
//  - Animated packed circles: https://bl.ocks.org/feifang/664c0f16adfcb4dea31b923f74e897a0
//  - Canvas force graph: https://bl.ocks.org/mbostock/3180395

const canvas = true;
export default () => {
  let visuals;
  if (canvas) {
    visuals = (
      <>
        <BubbleChartCanvas />
      </>
    )
  } else {
    visuals = (
      <>
        <BubbleChartSVG />
      </>
    )
  }
  return (
    <Layout>
      {visuals}
    </Layout>
  );
}
