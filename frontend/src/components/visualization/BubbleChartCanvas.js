import React, { useEffect } from 'react';
import { select } from 'd3-selection';
import { pack as d3Pack, hierarchy } from 'd3-hierarchy';
import { scaleOrdinal } from 'd3-scale';
import { schemePaired } from 'd3-scale-chromatic';
import { zoomIdentity } from 'd3-zoom';
import { generateFlatData } from './BubbleChart';

const colorCircle = scaleOrdinal(schemePaired);

const renderBubbleChartCanvas = (data, width, height) => {
  const pack = data => d3Pack()
    .size([width, height])
    .padding(8)(
      hierarchy({children: data})
      .sum(d => 1)
      .sort((a, b) => a.commitment - b.commitment)
    )

  const rootNode = pack(data);

  let transform = zoomIdentity;
  console.log('transform', transform);

  // TODO next step - work on zooming

  const canvas = select('#bubble-chart').append('canvas')
    .attr('width', width)
    .attr('height', height);
  const context = canvas.node().getContext('2d');
  context.clearRect(0, 0, width, height);

  rootNode.each((node) => {
    if (node.depth === 0) { return; }

    context.save();

    //Draw each circle
    context.fillStyle = colorCircle(node.data.commitment);
    context.scale(transform.k, transform.k);
    context.beginPath();
    context.arc(node.x, node.y, node.r,  0, 2 * Math.PI, true);
    context.fill();
    context.closePath();

    context.restore();
  });
}

export default () => {
  const data = generateFlatData(2000);
  const width = 700;
  const height = width;

  useEffect(() => {
    renderBubbleChartCanvas(data, width, height);
  });

  return (
    <>
      <h1>Bubble Chart</h1>
      <div id="bubble-chart"></div>
    </>
  );
};
