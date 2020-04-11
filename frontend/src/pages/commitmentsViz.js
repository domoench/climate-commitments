import React, { useState, useEffect } from 'react';
import { select, event } from 'd3-selection';
import { pack, hierarchy } from 'd3-hierarchy';
import { zoom } from 'd3-zoom';

import Layout from "../components/layout"

// TODO
// - [X] Basic circle packing visualization
// - [ ] Display labels
// - [ ] Dynamically set the visualization dimensions based on screen dimensions
// - [ ] Use real commitments data from server instead of dummy data

const renderGraph = (data, width, height) => {
  const packLayout = pack().size([width, height]).padding(4).size([width - 2, height - 2]);
  const rootNode = hierarchy(data).sum(d => 1);
  //const rootNode = hierarchy(data);
  console.log('rootNode', rootNode);
  packLayout(rootNode);

  const svg = select('.viz');
    //.attr('viewBox', [-width / 2, -height / 2, width, height])
    //.style("cursor", "pointer")
    //.on("click", () => zoom(root));
  svg.selectAll("*").remove(); // TODO Hack to deal with react re-renders

  const node = svg.append('g')
    .selectAll('circle')
    .data(rootNode.descendants().slice(1))
    .enter()
    .append('circle')
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; })
      .attr('r', function(d) { return d.r; })
      .style('fill', '#29ffb6')
      .style('opacity', 0.3)
      .style('stroke', '#207068')
}

const generateData = () => {
  const countryCodes = ['US', 'CA', 'CN', 'TW', 'IN', 'GL'];
  const postalCodes = ['pc_1', 'pc_2', 'pc_3', 'pc_4', 'pc_5', 'pc_6', 'pc_7', 'pc_8', 'pc_9', 'pc_10', 'pc_11', 'pc_12', 'pc_13'];
  const commitments = ['commitment_1', 'commitment_2', 'commitment_3', 'commitment_4', 'commitment_5'];

  const generateCountryNode = (countryCode) => {
    const randomPostalCodes = postalCodes.filter(pc => Math.random() > 0.6);

    return {
      name: countryCode,
      children: randomPostalCodes.map(pc => generatePostalNode(pc)),
    };
  };

  const generatePostalNode = (postalCode) => {
    const randomCommitments = postalCodes.filter(pc => Math.random() > 0.8);

    return {
      name: postalCode,
      children: randomCommitments.map(c => generateCommitmentNode(c)),
    };
  }

  const generateCommitmentNode = (commitment) => {
    const numCommitments = Math.ceil(Math.random() * 50); // TODO this looks bad when numbers get high
    const commitments = new Array(numCommitments);
    for (let i = 0; i < numCommitments; ++i) {
      commitments[i] = { name: '🌱' };
    }

    return {
      name: commitment,
      children: commitments,
    };
  }

  return {
    name: 'earth',
    children: countryCodes.map(cc => generateCountryNode(cc)),
  };
};

export default ({ commitmentData }) => {
  const data = generateData(); // TODO

  // Render the graph with D3 after React has finished mounting the SVG element on the DOM
  useEffect(() => {
    renderGraph(data, 700, 700);
  });

  return (
    <Layout>
      <svg width={700} height={700} className="viz">
      </svg>
    </Layout>
  );
}
