// Generates the next color in the sequence, going from 0,0,0 to 255,255,255.
// From: https://bocoup.com/weblog/2d-picking-in-canvas
let nextGenCol = 1;
export const genColor = () => {
  const ret = [];
  if(nextGenCol < 16777215){
    ret.push(nextGenCol & 0xff); // R
    ret.push((nextGenCol & 0xff00) >> 8); // G
    ret.push((nextGenCol & 0xff0000) >> 16); // B
    nextGenCol += 1;
  }
  return "rgb(" + ret.join(',') + ")";
};

