import { v4 as uuidv4 } from 'uuid';
import names from './names';
import { COMMITMENT_TYPES } from '../../commitments';

const randomElem = (arr) => arr[Math.ceil(Math.random() * 100) % arr.length]
const randomBool = () => randomElem([true, false]);

// Generate mock raw commitments data array
export const generateData = (n) => {
  const countryCodes = ['US', 'CA', 'CN', 'TW', 'IN', 'GL'];
  const postalCodes = ['pc_1', 'pc_2', 'pc_3', 'pc_4', 'pc_5', 'pc_6', 'pc_7', 'pc_8', 'pc_9', 'pc_10', 'pc_11', 'pc_12', 'pc_13'];

  const commitments = new Array(n);

  // TODO maybe make the randomization a little less uniform. e.g. make country ususally U.S.
  for (let i = 0; i < n; ++i) {
    commitments[i] = {
      name: generateName(),
      id: uuidv4(),
      commitments: {
        callRep: randomBool(),
        callBank: randomBool(),
        divestment: randomBool(),
        talk: randomBool(),
        participate: randomBool(),
      },
      country: randomElem(countryCodes),
      postalCode: randomElem(postalCodes),
    };
  }

  return commitments;
}

// Massage the raw commitments array into a hierarchy tree with the levels
// defined in the given hierarchyKeys array.
// Hierarchy keys may be: country, postal code, commitment type
export const createDataHierarchy = (hierarchyKeys, commitmentData) => {
  // Lookup array
  const depthForHK = {}
  hierarchyKeys.forEach((hk, i) => depthForHK[hk] = i + 1); // TODO: Useful?

  // Build leaves
  // For each commitment, you might create up to 5 leaf nodes
  const leafNodes = [];
  commitmentData.forEach((datum) => {
    Object.keys(COMMITMENT_TYPES).forEach((commitmentType) => {
      if (datum.commitments[commitmentType]) {
        leafNodes.push({
          ...datum,
          commitmentType,
          id: `${datum.id}-${commitmentType}`,
          // id: uuidv4(),
        });
      }
    });
  });

  // Build the tree downwards recursively
  const rootNode = {
    id: 'root',
    name: 'root',
    children: buildChildren('root', 0, leafNodes, hierarchyKeys),
  };
  return rootNode;
}

// Returns an array of subtrees, each root being a child of the parent
const buildChildren = (parentName, parentDepth, subtreeLeaves, hierarchyKeys) => {
  const treeHeight = hierarchyKeys.length + 1; // edges between root and leaves

  // Child node depth (current subtree root depth)
  const currDepth = parentDepth + 1;

  // Base case: Current depth is leaf node
  if (currDepth === treeHeight) {
    return subtreeLeaves;
  }

  const subtreeKey = hierarchyKeys[currDepth - 1]; // e.g. 'country'

  // Map from subtree keys to array of leaves that belong to that subtree
  const childToLeaves = {};

  // Separate leaf nodes by subtree root
  subtreeLeaves.forEach((leaf) => {
    const leafSubtreeKey = leaf[subtreeKey];
    if (leafSubtreeKey in childToLeaves) {
      childToLeaves[leafSubtreeKey].push(leaf)
    } else {
      childToLeaves[leafSubtreeKey] = [leaf];
    }
  })

  return Object.entries(childToLeaves).map(([subtreeKey, leaves]) => (
    {
      id: uuidv4(), // TODO not deterministic between hierarchy re-arrangments
      name: subtreeKey,
      children: buildChildren(subtreeKey, currDepth, childToLeaves[subtreeKey], hierarchyKeys)
    }
  ));
}

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

const randomName = () => names[Math.floor(Math.random() * names.length)]

const generateName = () => Math.random() < 0.2 ? 'Anonymous' : `${randomName()} ${randomName()}`;
