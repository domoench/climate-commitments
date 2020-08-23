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
const EMPTY_WIDTH = 1;
const colToCircle = {};

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
      {dimensions &&
        <Viz data={data} dimensions={dimensions} />
      }
    </div>
  ) ;
};

const Viz = ({ data, dimensions }) => {
  const { width } = dimensions ? dimensions : { width: EMPTY_WIDTH };
  const height = width;
  const diameter = Math.min(width*0.9, height*0.9);

  const domId = 'bubble-chart';

  const pack = data => d3Pack()
    .size([diameter, diameter])
    .padding(1)(
      hierarchy(data)
        .sum(d => 1)
        .sort((a, b) => a.data.id - b.data.id)
    );
  const rootNode = pack(data);

  // State that we don't want to store in react 'state' because it's d3/animation
  // related, and we don't want to re-render the react component when it changes
  // TODO: This is slightly better than global vars, but is still pretty hard to reason about
  const renderState = {
    // Canvas- and Transform-related
    canvasContext: null,
    hiddenCanvasContext: null,
    currentTransform: {}, // Current X,Y transform and scale

    // Center the canvas' 0,0 coordinate
    width,
    height,
    diameter,
    centerX: width / 2,
    centerY: height / 2,

    // d3 hierarchy, node-level related
    rootNode,
    focusNode: rootNode,
    viewOld: [rootNode.x, rootNode.y, rootNode.r * 2.05],

    // Animation-related
    interpolationDuration: 2000, // ms
    t: null, // The current timer instance
    interpolator: null,
  };

  renderState.currentTransform = {
    x: width / 2,
    y: height / 2,
    scale: 1
  };

  useEffect(() => {
    // The visible canvas
    const canvas = select(`#${domId}`).select('#canvas')
      .attr('width', width)
      .attr('height', height);
    renderState.canvasContext = canvas.node().getContext('2d');
    renderState.canvasContext.clearRect(0, 0, width, height);

    // The hidden canvas is... hidden. It hides underneath the visible canvas
    // with ugly but distinct colors that enable UI interaction via color-picking.
    const hiddenCanvas = select(`#${domId}`).select('#hiddenCanvas')
      .attr('width', width)
      .attr('height', height)
      .attr('style', 'display: none');
    renderState.hiddenCanvasContext = hiddenCanvas.node().getContext('2d');
    renderState.hiddenCanvasContext.clearRect(0, 0, width, height);

    // Set up zoom on mouse clicks
    const clickZoomHandler = function() {
      // Render the hidden color mapped canvas for picking
      renderPackedCirclesCanvas(rootNode, true, 0, renderState);

      // Pick the node being clicked: Map the color of the pixel clicked to the node object
      const [mouseX, mouseY] = mouse(this);
      const pixelCol = renderState.hiddenCanvasContext.getImageData(mouseX, mouseY, 1, 1).data;
      const colString = `rgb(${pixelCol[0]},${pixelCol[1]},${pixelCol[2]})`;
      const node = colToCircle[colString];

      // Zoom to it
      const newFocus = (node && renderState.focusNode !== node) ? node : rootNode;
      stopAnimation(renderState.t);
      zoomToCanvas(newFocus, renderState);
      renderState.t = startAnimation(renderState); // TODO consequence of repeatedly overwriting this? Old timers get GC'd?
    }
    canvas.on('click', clickZoomHandler);

    // The first render (without animation)
    renderPackedCirclesCanvas(rootNode, false, renderState.interpolationDuration, renderState);

    // Cleanup function
    return () => {
      stopAnimation(renderState.t);

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

const renderPackedCirclesCanvas = (rootNode, hidden, timeElapsed, renderState) => {
  const { width, height, focusNode, interpolationDuration } = renderState;
  if (width === EMPTY_WIDTH) {
    return
  }

  const { hiddenCanvasContext, canvasContext, centerX, centerY, currentTransform, diameter } = renderState;
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
    const animationComplete = timeElapsed >= interpolationDuration;
    const nodeIsLeafAndFocused = focusNode.height === 0 && node.height === 0;
    const nodeDeeperThanFocus = focusNode.depth + 1 === node.depth;
    const renderLabels = animationComplete && (nodeIsLeafAndFocused || nodeDeeperThanFocus);
    if (!hidden && renderLabels) {
      renderCenteredLabel(node, renderSettings);
    }
  });
}

const zoomToCanvas = (newFocusNode, renderState) => {
  if (newFocusNode === renderState.focusNode) return; // Noop

  renderState.focusNode = newFocusNode;
  const viewNew = [
    renderState.focusNode.x,
    renderState.focusNode.y,
    renderState.focusNode.r * 2.05
  ];

  // Create interpolation between current and new view
  renderState.interpolator = d3InterpolateZoom(renderState.viewOld, viewNew);
  renderState.interpolationDuration = renderState.interpolator.duration;

  renderState.viewOld = viewNew;
};

// Returns a new transform, interpolated over dt
const interpolateTransform = (timeElapsed, renderState) => {
  const { interpolator, diameter, interpolationDuration } = renderState;
  if (interpolator) {
    let normalizedDt = timeElapsed / interpolationDuration;
    var easedT = easeCubic(normalizedDt);

    const interpolatedView = interpolator(easedT);
    return {
      x: interpolatedView[0],
      y: interpolatedView[1],
      scale: diameter / interpolatedView[2],
    }
  }
};

const startAnimation = (renderState) => {
  const { interpolationDuration, rootNode } = renderState;
  const t = timer(elapsedSinceAnimationStart => {
    if (elapsedSinceAnimationStart <= interpolationDuration) {
      renderState.currentTransform = interpolateTransform(elapsedSinceAnimationStart, renderState);
    }

    renderPackedCirclesCanvas(rootNode, false, elapsedSinceAnimationStart, renderState);

    if (elapsedSinceAnimationStart >= interpolationDuration * 1.05) {
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
