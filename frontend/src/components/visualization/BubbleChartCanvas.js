import React, { useEffect } from 'react';
import { easeCubic } from 'd3-ease';
import { select } from 'd3-selection';
import { pack as d3Pack, hierarchy } from 'd3-hierarchy';
import { scaleOrdinal } from 'd3-scale';
import { schemePaired } from 'd3-scale-chromatic';
import { timer } from 'd3-timer';
import { interpolateZoom as d3InterpolateZoom } from 'd3-interpolate';
import { generateFlatData } from './BubbleChart';

const colorCircle = scaleOrdinal(schemePaired);

// D3 Viz vars
// TODO so many file globals, can we cleanup to make the functions easier to understand?
let context = null;
let lastRenderedTime = 0;
let dt = 0;
let interpolator = null;
let interpolationTimeElapsed = 0;
let duration = 2000; // ms
let zoomInfo = {};
let diameter = 0;
let centerX = 0;
let centerY = 0;
let focus = null;
let vOld = null;

const renderBubbleChartCanvas = (rootNode, width, height) => {
  context.clearRect(0, 0, width, height);

  rootNode.each((node) => {
    if (node.depth === 0) { return; }

    context.save();

    //Draw each circle
    context.fillStyle = colorCircle(node.data.commitment);
    context.beginPath();
    context.arc(
      (node.x - zoomInfo.centerX) * zoomInfo.scale + centerX,
      (node.y - zoomInfo.centerY) * zoomInfo.scale + centerY,
      node.r * zoomInfo.scale,
      0,
      2 * Math.PI,
      true
    );
    context.fill();
    context.closePath();

    context.restore();
  });
}

const zoomToCanvas = focusNode => {
  focus = focusNode;
  const v = [focus.x, focus.y, focus.r * 2.05]; // New viewport

  // Create interpolation between current and new viewport
  interpolator = d3InterpolateZoom(vOld, v);
  interpolationTimeElapsed = 0;
  duration = interpolator.duration;

  vOld = v;
};

const interpolateZoom = dt => {
  if (interpolator) {
    interpolationTimeElapsed += dt;
    var easedT = easeCubic(interpolationTimeElapsed / duration);

    zoomInfo.centerX = interpolator(easedT)[0];
    zoomInfo.centerY = interpolator(easedT)[1];
    zoomInfo.scale = diameter / interpolator(easedT)[2];

    // Once zoom is done, destroy this interpolator
    if (interpolationTimeElapsed >= duration) {
      interpolator = null;
    }
  }
};

export default () => {
  const width = 1080;
  const height = width;
  centerX = width / 2;
  centerY = height / 2;
  diameter = Math.min(width*0.9, height*0.9);
  const data = generateFlatData(4000);
  const pack = data => d3Pack()
    .size([diameter, diameter])
    .padding(8)(
      hierarchy({children: data})
      .sum(d => 1)
      .sort((a, b) => a.commitment - b.commitment)
    )
  const rootNode = pack(data);
  focus = rootNode;
  vOld = [focus.x, focus.y, focus.r * 2.05];


  zoomInfo = {
    centerX: width / 2,
    centerY: height / 2,
    scale: 1
  };

  useEffect(() => {
    const canvas = select('#bubble-chart').append('canvas')
      .attr('width', width)
      .attr('height', height);
    context = canvas.node().getContext('2d');

    // Start the d3 animation
    timer(elapsedSinceAnimationStart => {
      dt = elapsedSinceAnimationStart - lastRenderedTime;
      lastRenderedTime = elapsedSinceAnimationStart;
      interpolateZoom(dt);
      renderBubbleChartCanvas(rootNode, width, height);
    });

    // Set up zoom click handler
    document.getElementById('bubble-chart').addEventListener('click', e => {
      // For now, choose a random node to focus on or the rootNode
      if (focus !== rootNode) {
        focus = rootNode;
      } else {
        const nodes = rootNode.descendants();
        focus = nodes[Math.floor(Math.random() * nodes.length)];
      }
      zoomToCanvas(focus);
    });
  });

  return (
    <>
      <h1>Bubble Chart</h1>
      <div id="bubble-chart"></div>
    </>
  );
};
