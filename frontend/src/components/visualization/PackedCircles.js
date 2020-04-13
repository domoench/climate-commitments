import React, { useEffect } from 'react';
import { select, event } from 'd3-selection';
import { pack, hierarchy } from 'd3-hierarchy';
import { interpolateZoom } from 'd3-interpolate';
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
      name: countryCode,
      children: randomPostalCodes.map(pc => generatePostalNode(pc)),
    };
  };

  const generatePostalNode = (postalCode) => {
    const randomCommitments = commitments.filter(pc => Math.random() > 0.8);

    return {
      id: uuidv4(),
      name: postalCode,
      children: randomCommitments.map(c => generateCommitmentNode(c)),
    };
  }

  const generateCommitmentNode = (commitment) => {
    const numCommitments = Math.max(1, Math.ceil(Math.random() * 3)); // TODO this looks bad when numbers get high
    const commitments = new Array(numCommitments);
    for (let i = 0; i < numCommitments; ++i) {
      commitments[i] = {
        id: uuidv4(),
        name: '🌱'
      };
    }

    return {
      id: uuidv4(),
      name: commitment,
      children: commitments,
    };
  }

  return {
    id: uuidv4(),
    name: 'earth',
    children: countryCodes.map(cc => generateCountryNode(cc)),
  };
};

const renderPackedCircleGraph = (_rootNode, lookup, width, height) => {
  console.log('lookup', lookup);
  let view;
  const rootNode = _rootNode.copy(); // Don't modify the original
  let focus = rootNode;
  const packLayout = pack().size([width, height]).padding(4).size([width - 2, height - 2]);
  packLayout(rootNode);
  // console.log('rootNode.leaves()', rootNode.leaves());

  // Remove leaf nodes if we aren't zoomed in
  // There are probably too many to render quickly
  // PROB: Ok cool that works, but how do we add them back
  console.log('rootNode.descendents.length', rootNode.descendants().length);
  if (focus.depth < 2) {
    rootNode.each((node) => {
      if (node.height == 1) {
        node.children = [];
      }
    })
  }
  console.log('rootNode.descendents.length', rootNode.descendants().length);
  console.log('_rootNode.descendents.length', rootNode.descendants().length);

  const svg = select('.packed-circles-viz')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`)
    .style('display', 'block')
    .attr('text-anchor', 'middle')
    .on('click', () => zoom(rootNode));

  const node = svg.select('g').selectAll('circle')
    .data(rootNode.descendants(), d => d.data.id)
    .join('circle')
      .style('fill', '#29ffb6')
      .style('opacity', 0.3)
      .attr('stroke', '#ccc')
      .on('mouseover', function() { select(this).attr('stroke', '#f00'); })
      .on('mouseout', function() { select(this).attr('stroke', '#bbb'); })
      //.on('click', d => focus !== d && (zoom(d), event.stopPropagation()))
      .on('click', d => renderPackedCircleGraph(lookup[d.data.id], lookup, width, height)) // This gives me zoom + ignoring everything else

  // Following this example: https://observablehq.com/@d3/zoomable-circle-packing
  const zoomTo = (v) => {
    const k = width / v[2];

    view = v;

    node.attr('transform', d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
    node.attr('r', d => d.r * k);
  }
  zoomTo([rootNode.x, rootNode.y, rootNode.r * 2]);

  const zoom = (newFocus) => {
    console.log('Zooming to: ', newFocus.data.name);
    focus = newFocus;

    const transition = svg.transition()
      .duration(event.altKey ? 7500 : 750)
      .tween('zoom', d => {
        const i = interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
        return t => zoomTo(i(t));
      });
  }
}

export default () => {
  const data = generateHierarchicalData(); // TODO
  const rootNode = hierarchy(data).sum(d => 1);

  // Remember leaf nodes
  /*
  const leavesByParent = rootNode.leaves().reduce((acc, cur) => {
    const parent_id = cur.parent.data.id
    if (parent_id in acc) {
      acc[parent_id] = [...acc[parent_id], cur];
    } else {
      acc[parent_id] = [cur];
    }
    return acc;
  }, {})
  console.log('leavesByParent', leavesByParent);
  */

  // ID to Node object lookup
  const lookup = rootNode.descendants().reduce((acc, cur) => {
    acc[cur.data.id] = cur;
    return acc;
  }, {})

  // Render the graph with D3 after React has finished mounting the SVG element on the DOM
  useEffect(() => {
    renderPackedCircleGraph(rootNode, lookup, 700, 700);
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
