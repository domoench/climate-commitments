import React, { useState, useEffect } from 'react';
import { select, event } from 'd3-selection';
import { pack, hierarchy } from 'd3-hierarchy';
import { scaleOrdinal } from 'd3-scale';
import { schemeSet3 } from 'd3-scale-chromatic';
import { zoom } from 'd3-zoom';
import { v4 as uuidv4 } from 'uuid';

// Generate flat hierarchichal data
export const generateFlatData = (n) => {
  const countryCodes = ['US', 'CA', 'CN', 'TW', 'IN', 'GL'];
  const postalCodes = ['pc_1', 'pc_2', 'pc_3', 'pc_4', 'pc_5', 'pc_6', 'pc_7', 'pc_8', 'pc_9', 'pc_10', 'pc_11', 'pc_12', 'pc_13'];
  const commitmentTypes = ['commitment_1', 'commitment_2', 'commitment_3', 'commitment_4', 'commitment_5'];

  const randomElem = (arr) => arr[Math.ceil(Math.random() * 100) % arr.length]

  // TODO this starts to break down when we get above a few hundred
  const numCommitments = n;
  const commitments = new Array(numCommitments);

  for (let i = 0; i < numCommitments; ++i) {
    commitments[i] = {
      name: '🌱',
      id: uuidv4(),
      commitment: randomElem(commitmentTypes),
      country: randomElem(countryCodes),
      postalCode: randomElem(postalCodes),
    };
  }
  return commitments;
};

const renderBubbleChartSVG = (data, width, height) => {
  const packLayout = pack().size([width, height]).padding(8).size([width - 2, height - 2]);
  const rootNode = hierarchy({children: data})
    .sum(d => 1)
    .sort((a, b) => a.commitment - b.commitment);

  packLayout(rootNode);

  const color = scaleOrdinal(schemeSet3);

  const svg = select('.bubble-chart-viz')
    .attr('text-anchor', 'middle');

  svg.selectAll('*').remove(); // TODO Hack to deal with react re-renders
  const g = svg.append('g');

  const node = g.selectAll('circle')
    .data(rootNode.leaves())
    .enter()
    .append('circle')
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; })
      .attr('r', function(d) { return d.r; })
      .style('fill', d => color(d.data.commitment))
      .style('opacity', 0.3)
      .style('stroke', '#207068')

  const text = g.selectAll('text')
    .data(rootNode.leaves())
    .enter().append('text')
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .style('fill-opacity', function(d) { return d.parent === rootNode ? 1 : 0; })
      .text(function(d) { return d.data.commitment; })
      .style("font-size", function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 18) + "px"; })
      .attr("dy", ".35em");
}

export default () => {
  const data = generateFlatData();

  // Render the graph with D3 after React has finished mounting the SVG element on the DOM
  useEffect(() => {
    renderBubbleChartSVG(data, 700, 700);
  });

  return (
    <>
      <h1>Bubble Chart</h1>
      <svg width={700} height={700} className="bubble-chart-viz">
      </svg>
    </>
  );
};
