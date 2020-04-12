import React, { useState, useEffect } from 'react';
import { select, event } from 'd3-selection';
import { pack, hierarchy } from 'd3-hierarchy';
import { zoom } from 'd3-zoom';
import { v4 as uuidv4 } from 'uuid';

// Generate dummy hierarchichal data
// Hierarchy: Country -> Postal Code -> Commitment Type -> Individual commitments
const generateHierarchicalData = () => {
  const countryCodes = ['US', 'CA', 'CN', 'TW', 'IN', 'GL'];
  const postalCodes = ['pc_1', 'pc_2', 'pc_3', 'pc_4', 'pc_5', 'pc_6', 'pc_7', 'pc_8', 'pc_9', 'pc_10', 'pc_11', 'pc_12', 'pc_13'];
  const commitments = ['commitment_1', 'commitment_2', 'commitment_3', 'commitment_4', 'commitment_5'];

  const generateCountryNode = (countryCode) => {
    const randomPostalCodes = postalCodes.filter(pc => Math.random() > 0.6);

    return {
      // TODO: Add ids to all data nodes.
      // Try data join keys so we can add/remove nodes => Dynamic aggregation on zoom out
      id: uuidv4(),
      visible: true,
      name: countryCode,
      children: randomPostalCodes.map(pc => generatePostalNode(pc)),
    };
  };

  const generatePostalNode = (postalCode) => {
    const randomCommitments = commitments.filter(pc => Math.random() > 0.8);

    return {
      id: uuidv4(),
      visible: true,
      name: postalCode,
      children: randomCommitments.map(c => generateCommitmentNode(c)),
    };
  }

  const generateCommitmentNode = (commitment) => {
    const numCommitments = Math.ceil(Math.random() * 50); // TODO this looks bad when numbers get high
    const commitments = new Array(numCommitments);
    for (let i = 0; i < numCommitments; ++i) {
      commitments[i] = {
        id: uuidv4(),
        name: '🌱'
      };
    }

    return {
      id: uuidv4(),
      visible: true,
      name: commitment,
      children: commitments,
    };
  }

  return {
    id: uuidv4(),
    visible: true,
    name: 'earth',
    children: countryCodes.map(cc => generateCountryNode(cc)),
  };
};

const renderPackedCircleGraph = (rootNode, width, height) => {
  const packLayout = pack().size([width, height]).padding(4).size([width - 2, height - 2]);
  packLayout(rootNode);

  const svg = select('.packed-circles-viz')
    .attr('text-anchor', 'middle');
  const g = svg.select('g');

  const node = g.selectAll('circle')
    .data(rootNode.descendants().slice(1), d => d.data.id)

  node.transition()
    .duration(300)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) { return d.r; });

  node.enter()
    .append('circle')
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; })
      .attr('r', function(d) { return d.r; })
      .style('fill', '#29ffb6')
      .style('opacity', 0.3)
      .style('stroke', '#207068')

  node.exit().remove();

  /*
  const text = g.selectAll("text")
    .data(rootNode.descendants().slice(1))
    .enter().append("text")
      .attr("class", "label")
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; })
      .style("fill-opacity", function(d) { return d.parent === rootNode ? 0.1 : 0; })
      .style("display", function(d) { return d.parent === rootNode ? "inline" : "none"; })
      .text(function(d) { return d.data.name; })
      .style("font-size", function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 18) + "px"; })
      .attr("dy", ".35em");

  text.exit().remove();
  */
}

export default () => {
  const data = generateHierarchicalData(); // TODO
  const rootNode = hierarchy(data).sum(d => 1);

  // Render the graph with D3 after React has finished mounting the SVG element on the DOM
  useEffect(() => {
    renderPackedCircleGraph(rootNode, 700, 700);

    setTimeout(() => {
      // TEST dynamically remov nodes from the hierarchy
      console.log('removing first child', rootNode.children[0]);
      rootNode.children = rootNode.children.slice(1);
      renderPackedCircleGraph(rootNode, 700, 700)
    }, 2000);
  });

  return (
    <>
      <h1>Packed Circles</h1>
      <svg width={700} height={700} className="packed-circles-viz">
        <g></g>
      </svg>
    </>
  );
};
