import React, { useEffect, useState, useRef } from 'react';
import { easeCubic } from 'd3-ease';
import { select, mouse } from 'd3-selection';
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

// The current timer instance
let t;


const renderBubbleChartCanvas = (rootNode, width, height, hidden) => {
  console.log(`renderBubbleChart(). hidden:${hidden}. scale:${zoomInfo.scale}`);
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

      // TODO Attempt to fix anti-aliasing color picking bug.
      // This doesn't fix it fully, not sure whether this helps a little or not
      ctx.isSmoothingEnabled = false;
    } else {
      const isLeaf = node.height === 0;
      const colorKey = isLeaf ? node.data.commitmentType : node.depth;
      ctx.fillStyle = colorCircle(colorKey);
    }

    // Scale and translate positions
    const nodeX = (node.x - zoomInfo.centerX) * zoomInfo.scale + centerX;
    const nodeY = (node.y - zoomInfo.centerY) * zoomInfo.scale + centerY;
    const nodeR = node.r * zoomInfo.scale;

    const nodeWayDeeperThanFocus = node.depth - focus.depth >= 4;
    if (!nodeWayDeeperThanFocus) {
      ctx.beginPath();
      ctx.arc(nodeX, nodeY, nodeR, 0, 2 * Math.PI, true);
      ctx.fill();
      ctx.closePath();
    }
  });

  // Draw labels on top (requires second loop)
  // TODO If this gets too inefficient, you could queue up the required label renders during the
  // first loop then simply execute here.
  rootNode.each((node) => {
    // Scale and translate positions
    const nodeX = (node.x - zoomInfo.centerX) * zoomInfo.scale + centerX;
    const nodeY = (node.y - zoomInfo.centerY) * zoomInfo.scale + centerY;
    const nodeR = node.r * zoomInfo.scale;

    // Commitment Labels.
    // Only render after the animation is complete and if node is at or 1 lower than focus level.
    // TODO: Only render labels for descendents of the focused node
    const animationComplete = interpolator === null;
    const nodeIsLeafAndFocused = focus.height === 0 && node.height === 0;
    const nodeDeeperThanFocus = focus.depth + 1 === node.depth;
    const renderLabels = animationComplete && (nodeIsLeafAndFocused || nodeDeeperThanFocus);
    if (!hidden && renderLabels) {
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
  console.log(`zoomToCanvas(). duration:${duration} new focus ${focus.data?.name}: `, focus);
  // console.log('interpolate from: ', vOld);
  // console.log('interpolate to: ', v);

  // Create interpolation between current and new viewport
  // interpolator = null; // TODO try destroying here
  interpolationTimeElapsed = 0;
  interpolator = d3InterpolateZoom(vOld, v);
  duration = interpolator.duration;

  vOld = v;
};

const interpolateZoom = dt => {
  if (interpolator) {
    interpolationTimeElapsed += dt;
    let normalizedDt = interpolationTimeElapsed / duration;
    // console.log(`dt:${Math.floor(dt)}. normalizedDt: elapsed:${Math.floor(interpolationTimeElapsed)} / duration:${Math.floor(duration)}.`);
    var easedT = easeCubic(normalizedDt);

    const interpolated = interpolator(easedT);
    // console.log(`interpolateZoom(). normalizedDt:${normalizedDt}. easedT:${easedT}. [x,y,r]:${interpolated}`);
    zoomInfo.centerX = interpolated[0];
    zoomInfo.centerY = interpolated[1];
    zoomInfo.scale = diameter / interpolated[2];

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
  focus = rootNode;
  vOld = [focus.x, focus.y, focus.r * 2.05];

  zoomInfo = {
    centerX: width / 2,
    centerY: height / 2,
    scale: 1
  };

  const startAnimation = () => {
    // Reset animation state vars
    lastRenderedTime = 0;

    const t = timer(elapsedSinceAnimationStart => {
      dt = elapsedSinceAnimationStart - lastRenderedTime;
      lastRenderedTime = elapsedSinceAnimationStart;
      interpolateZoom(dt);
      renderBubbleChartCanvas(rootNode, width, height, false);

      // TODO something smarter
      if (elapsedSinceAnimationStart > duration * 3) {
        t.stop();
      }
    });
    return t;
  }

  const stopAnimation = (t) => {
    console.log('stopping animation for: ', t);
    if (t) {
      t.stop();
    }
  }

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


    const clickZoomHandler = function() {
      console.log('~~~ 🦀 CLICK 🦀 ~~~');
      // Render the hidden color mapped canvas for 'picking'
      renderBubbleChartCanvas(rootNode, width, height, true);

      // Pick the node being clicked
      const [mouseX, mouseY] = mouse(this);
      console.log(`[mouseX, mouseY]: `, [mouseX, mouseY]);
      const pixelCol = hiddenContext.getImageData(mouseX, mouseY, 1, 1).data;
      const colString = `rgb(${pixelCol[0]},${pixelCol[1]},${pixelCol[2]})`;
      // console.log(`colToCircle: `, colToCircle);
      console.log(`colString: `, colString);
      const node = colToCircle[colString];
      console.log(`clicked ${node?.data?.name}: `, node);

      // TODO picking bug: When zoomed way out and attempting to click on an individual node,
      // anti-aliasing of the small individual nodes creates pixels that are slightly off from
      // the intended pick color - leading to non-existant node lookups, or sometimes existing but
      // wrong node picks.

      // Zoom to it
      const newFocus = (node && focus !== node) ? node : rootNode;
      stopAnimation(t);
      zoomToCanvas(newFocus);
      t = startAnimation(); // TODO consequence of repeatedly overwriting this? Old timers get GC'd?
    }
    canvas.on('click', clickZoomHandler);

    // The first render (without animation)
    renderBubbleChartCanvas(rootNode, width, height, false);

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
