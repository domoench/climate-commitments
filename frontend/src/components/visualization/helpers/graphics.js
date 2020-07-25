//
// COORDINATE AND TRANFORM HELPERS
//

export const transformNode = (node, renderSettings) => {
  const { currentTransform: transform, centerX, centerY } = renderSettings;
  return [
    (node.x - transform.x) * transform.scale + centerX,
    (node.y - transform.y) * transform.scale + centerY,
    node.r * transform.scale,
  ];
}

//
// CANVAS RENDERING HELPERS
//

export const renderCircle = (node, renderSettings) => {
  const { ctx } = renderSettings;
  const [nodeX, nodeY, nodeR] = transformNode(node, renderSettings);

  ctx.beginPath();
  ctx.arc(nodeX, nodeY, nodeR, 0, 2 * Math.PI, true);
  ctx.fill();
  ctx.closePath();
}

export const renderCenteredLabel = (node, renderSettings) => {
  const { ctx, diameter, baseFontSize } = renderSettings;
  const [nodeX, nodeY, nodeR] = transformNode(node, renderSettings);

  const sizeRatio = nodeR / diameter;
  const fontSize = Math.floor(baseFontSize * sizeRatio);
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText(node.data.name, nodeX, nodeY);
}
