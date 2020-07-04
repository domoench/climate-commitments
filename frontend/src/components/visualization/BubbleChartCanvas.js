import React, { useEffect, useState, useRef } from 'react';
import { easeCubic } from 'd3-ease';
import { select } from 'd3-selection';
import { pack as d3Pack, hierarchy } from 'd3-hierarchy';
import { scaleOrdinal } from 'd3-scale';
import { schemePaired } from 'd3-scale-chromatic';
import { timer } from 'd3-timer';
import _debounce from 'lodash.debounce';
import { interpolateZoom as d3InterpolateZoom } from 'd3-interpolate';
import { genColor } from './helpers';

const baseFontSize = 200;

const colorCircle = scaleOrdinal(schemePaired);

// D3 Viz vars
// TODO so many file globals, can we cleanup to make the functions easier to understand?
let context = null;
let hiddenContext = null;
const colToCircle = {};
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

const renderBubbleChartCanvas = (rootNode, width, height, hidden) => {
  console.log(`renderBubbleChartCanvas() width:${width}. height:${height}. hidden:${hidden}`);
  // Current context
  const ctx = hidden ? hiddenContext : context;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw each circle
  rootNode.each((node) => {
    if (node.depth === 0) { return; }

    if (hidden) {
      if (!node.pickColor) {
        node.pickColor = genColor();
        colToCircle[node.pickColor] = node;
      }
      ctx.fillStyle = node.pickColor;
    } else {
      const isLeaf = node.height === 0;
      // const colorKey = isLeaf ? node.data.commitmentType : node.depth;
      const colorKey = isLeaf ? node.depth : node.data.name;
      ctx.fillStyle = colorCircle(colorKey); // TODO
    }

    // Scale and translate positions
    const nodeX = (node.x - zoomInfo.centerX) * zoomInfo.scale + centerX;
    const nodeY = (node.y - zoomInfo.centerY) * zoomInfo.scale + centerY;
    const nodeR = node.r * zoomInfo.scale;

    ctx.beginPath();
    ctx.arc(nodeX, nodeY, nodeR, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();

    // Commitment Labels.
    // Only render after the animation is complete and focus is on individual commitments.
    const renderLabels = true;
    /*
    const renderLabels =
      interpolator === null &&
      (focus.height === 0 && node.height === 0);
      */
    if (renderLabels) {
      const sizeRatio = nodeR / diameter;
      const fontSize = Math.floor(baseFontSize * sizeRatio);
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.fillText(node.data.name, nodeX, nodeY);
    }
  });
}

const zoomToCanvas = focusNode => {
  if (focusNode === focus) return; // Noop

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

// Viz wrapper: Manages dynamically resizing the visualization.
export default ({ data }) => {
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState(null);

  // Measure the browser-rendered dimensions of a DOM element
  const setVizDimensions = () => {
    const { width, height } = ref.current.getBoundingClientRect();
    setDimensions({ width, height });
  };

  useEffect(() => {
    setVizDimensions();
    const debouncedSetDimensions = _debounce(() => setVizDimensions(), 160);
    window.addEventListener('resize', debouncedSetDimensions);
    return () => {
      window.removeEventListener('resize', debouncedSetDimensions);
    };
  }, [ref]);

  return (
    <div ref={ref}>
      <Viz data={data} dimensions={dimensions} />
    </div>
  );
};

const Viz = ({ data, dimensions }) => {
  const { width } = dimensions ? dimensions : { width: 1, height: 1};
  const height = width;

  const domId = 'bubble-chart';

  centerX = width / 2;
  centerY = height / 2;
  diameter = Math.min(width*0.9, height*0.9);
  const pack = data => d3Pack()
    .size([diameter, diameter])
    .padding(1)(
      hierarchy(data)
        .sum(d => 1)
        .sort((a, b) => a.id - b.id) // TODO I think this doesn't make sense
    );
  const rootNode = pack(data);
  focus = rootNode;
  vOld = [focus.x, focus.y, focus.r * 2.05];

  zoomInfo = {
    centerX: width / 2,
    centerY: height / 2,
    scale: 1
  };

  useEffect(() => {
    const canvas = select(`#${domId}`).select('#canvas')
      .attr('width', width)
      .attr('height', height);
    context = canvas.node().getContext('2d');
    context.clearRect(0, 0, width, height);

    const hiddenCanvas = select(`#${domId}`).select('#hiddenCanvas')
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'display: none');
    hiddenContext = hiddenCanvas.node().getContext('2d');
    hiddenContext.clearRect(0, 0, width, height);

    // Start the d3 animation
    const t = timer(elapsedSinceAnimationStart => {
      dt = elapsedSinceAnimationStart - lastRenderedTime;
      lastRenderedTime = elapsedSinceAnimationStart;
      interpolateZoom(dt);
      renderBubbleChartCanvas(rootNode, width, height, false);
    });

    // Set up zoom click handler
    const clickZoomHandler = e => {
      // Render the hidden color mapped canvas for 'picking'
      renderBubbleChartCanvas(rootNode, width, height, true);

      // Pick the node being clicked
      const mouseX = e.layerX;
			const mouseY = e.layerY;
      console.log('click! ', [mouseX, mouseY]);
      const pixelCol = hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
      const colString = `rgb(${pixelCol[0]},${pixelCol[1]},${pixelCol[2]})`;
      const node = colToCircle[colString];
      console.log('node clicked', node);

      const newFocus = (node && focus !== node) ? node : rootNode;
      zoomToCanvas(newFocus);
    }
    document.getElementById(`${domId}`).addEventListener('click', clickZoomHandler);

    // Cleanup function
    return () => {
      // Stop the timer and animations
      t.stop();

      // Remove event handlers
      document.getElementById(`${domId}`).removeEventListener('click', clickZoomHandler);
    }
  });

  return (
    <>
      <div id={domId}>
        <canvas id="canvas"></canvas>
        <canvas id="hiddenCanvas"></canvas>
      </div>
    </>
  );
};
