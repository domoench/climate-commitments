import React, { useEffect, useState, useRef } from 'react';
import { easeCubic } from 'd3-ease';
import { select, mouse } from 'd3-selection';
import { pack as d3Pack, hierarchy } from 'd3-hierarchy';
import { timer } from 'd3-timer';
import _debounce from 'lodash.debounce';
import { interpolateZoom as d3InterpolateZoom } from 'd3-interpolate';
import { colorCircle, genColor } from './helpers/color';
import { renderCircle, renderCenteredLabel } from './helpers/graphics';

// CONSTANTS
const colToCircle = {};

// GLOBAL VARIABLES
// State that we don't want to store in react 'state' because it's animation
// related, and we don't want to re-render the react component when it changes
// TODO so many file globals, cleanup to make the functions easier to understand

// d3 hierarchy, node-level related
let focusNode = null;
let viewOld = null;

// Canvas- and Transform-related
let canvasContext = null;
let hiddenCanvasContext = null;
let diameter = 0;
let centerX = 0;
let centerY = 0;
let currentTransform = {}; // Current X,Y transform and scale

// Animation-related
let duration = 2000; // ms
let t; // The current timer instance
// let dt = 0;
let lastRenderedTime = 0;
let interpolator = null;
let interpolationTimeElapsed = 0;

const renderPackedCirclesCanvas = (rootNode, width, height, hidden) => {
  // Current canvas context
  const ctx = hidden ? hiddenCanvasContext : canvasContext;
  const renderSettings = {
    ctx,
    currentTransform,
    centerX,
    centerY,
    diameter,
    baseFontSize: 200,
  }

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw each circle
  rootNode.each((node) => {
    if (node.depth === 0) { return; }

    if (hidden) {
      // Attempt to reduce anti-aliasing color picking issue.
      ctx.isSmoothingEnabled = false;

      if (!node.pickColor) {
        node.pickColor = genColor();
        colToCircle[node.pickColor] = node;
      }
      ctx.fillStyle = node.pickColor;
    } else {
      const isLeaf = node.height === 0;
      const colorKey = isLeaf ? node.data.commitmentType : node.depth;
      ctx.fillStyle = colorCircle(colorKey);
    }

    // If not hidden canvas, always render. If it is the hidden canvas, only
    // render nodes one level down from focus and higher. This helps with
    // anti-aliasing color-picking issue because if we pick a deep leaf node from
    // a high level (e.g. root) focus, the small leaf nodes are anti-aliased so the
    // pixel chosen is often a blended color rather than the pickColor. If we only
    // allow picking and zooming to 1 level below focus we avoid that problem.
    const nodeNotTooDeep = node.depth - focusNode.depth <= 1;
    if (!hidden || nodeNotTooDeep) {
      renderCircle(node, renderSettings);
    }
  });

  // Draw labels on top (requires second loop)
  // TODO If this gets too inefficient, you could queue up the required label renders during the
  // first loop then simply execute here.
  rootNode.each((node) => {
    // Only render after the animation is complete and if node is at or 1 lower than focus level.
    // TODO: Only render labels for descendents of the focused node
    const animationComplete = interpolator === null;
    const nodeIsLeafAndFocused = focusNode.height === 0 && node.height === 0;
    const nodeDeeperThanFocus = focusNode.depth + 1 === node.depth;
    const renderLabels = animationComplete && (nodeIsLeafAndFocused || nodeDeeperThanFocus);
    if (!hidden && renderLabels) {
      renderCenteredLabel(node, renderSettings);
    }
  });
}

const zoomToCanvas = newFocusNode => {
  if (newFocusNode === focusNode) return; // Noop

  focusNode = newFocusNode;
  const v = [focusNode.x, focusNode.y, focusNode.r * 2.05]; // New viewport

  // Create interpolation between current and new viewport
  // interpolator = null; // TODO try destroying here
  interpolationTimeElapsed = 0;
  interpolator = d3InterpolateZoom(viewOld, v);
  duration = interpolator.duration;

  viewOld = v;
};

const interpolateZoom = dt => {
  if (interpolator) {
    interpolationTimeElapsed += dt;
    let normalizedDt = interpolationTimeElapsed / duration;
    var easedT = easeCubic(normalizedDt);

    const interpolated = interpolator(easedT);
    currentTransform.x = interpolated[0];
    currentTransform.y = interpolated[1];
    currentTransform.scale = diameter / interpolated[2];

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
    const debouncedSetDimensions = _debounce(() => setVizDimensions(), 250);
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

  // Center the canvas' 0,0 coordinate
  centerX = width / 2;
  centerY = height / 2;

  diameter = Math.min(width*0.9, height*0.9);
  const pack = data => d3Pack()
    .size([diameter, diameter])
    .padding(1)(
      hierarchy(data)
        .sum(d => 1)
        .sort((a, b) => a.data.id - b.data.id)
    );
  const rootNode = pack(data);
  focusNode = rootNode;
  viewOld = [focusNode.x, focusNode.y, focusNode.r * 2.05];

  currentTransform = {
    x: width / 2,
    y: height / 2,
    scale: 1
  };

  const startAnimation = () => {
    // Reset animation state vars
    lastRenderedTime = 0;

    const t = timer(elapsedSinceAnimationStart => {
      const dt = elapsedSinceAnimationStart - lastRenderedTime;
      lastRenderedTime = elapsedSinceAnimationStart;
      interpolateZoom(dt);
      renderPackedCirclesCanvas(rootNode, width, height, false);

      // TODO something smarter
      if (elapsedSinceAnimationStart > duration * 3) {
        t.stop();
      }
    });
    return t;
  }

  const stopAnimation = (t) => {
    if (t) {
      t.stop();
    }
  }

  useEffect(() => {
    // The visible canvas
    const canvas = select(`#${domId}`).select('#canvas')
      .attr('width', width)
      .attr('height', height);
    canvasContext = canvas.node().getContext('2d');
    canvasContext.clearRect(0, 0, width, height);

    // The hidden canvas is... hidden. It hides underneath the visible canvas
    // with ugly but distinct colors that enable UI interaction via color-picking.
    const hiddenCanvas = select(`#${domId}`).select('#hiddenCanvas')
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'display: none');
    hiddenCanvasContext = hiddenCanvas.node().getContext('2d');
    hiddenCanvasContext.clearRect(0, 0, width, height);

    // Set up zoom on mouse clicks
    const clickZoomHandler = function() {
      // Render the hidden color mapped canvas for picking
      renderPackedCirclesCanvas(rootNode, width, height, true);

      // Pick the node being clicked: Map the color of the pixel clicked to the node object
      const [mouseX, mouseY] = mouse(this);
      const pixelCol = hiddenCanvasContext.getImageData(mouseX, mouseY, 1, 1).data;
      const colString = `rgb(${pixelCol[0]},${pixelCol[1]},${pixelCol[2]})`;
      const node = colToCircle[colString];

      // Zoom to it
      const newFocus = (node && focusNode !== node) ? node : rootNode;
      stopAnimation(t);
      zoomToCanvas(newFocus);
      t = startAnimation(); // TODO consequence of repeatedly overwriting this? Old timers get GC'd?
    }
    canvas.on('click', clickZoomHandler);

    // The first render (without animation)
    renderPackedCirclesCanvas(rootNode, width, height, false);

    // Cleanup function
    return () => {
      stopAnimation(t);

      // Remove event handlers
      canvas.on('click', null);
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
