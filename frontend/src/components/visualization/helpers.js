import { v4 as uuidv4 } from 'uuid';

// Generate dummy hierarchichal data
// Hierarchy: Country -> Postal Code -> Commitment Type -> Individual commitments
export const generateHierarchicalData = () => {
  const countryCodes = ['US', 'CA', 'CN', 'TW', 'IN', 'GL'];
  const postalCodes = ['pc_1', 'pc_2', 'pc_3', 'pc_4', 'pc_5', 'pc_6', 'pc_7', 'pc_8', 'pc_9', 'pc_10', 'pc_11', 'pc_12', 'pc_13'];
  const commitments = ['commitment_1', 'commitment_2', 'commitment_3', 'commitment_4', 'commitment_5'];

  const generateCountryNode = (countryCode) => {
    const randomPostalCodes = postalCodes.filter(pc => Math.random() > 0.6);

    return {
      id: uuidv4(),
      name: countryCode,
      children: randomPostalCodes.map(pc => generatePostalNode(pc, countryCode)),
    };
  };

  const generatePostalNode = (postalCode, countryCode) => {
    // TODO this can lead to non-leaf nodes with no children
    const randomCommitments = commitments.filter(pc => Math.random() > 0.8);

    return {
      id: uuidv4(),
      name: postalCode,
      children: randomCommitments.map(c => generateCommitmentNode(c, countryCode)),
    };
  }

  const generateCommitmentNode = (commitment, countryCode) => {
    const numCommitments = countryCode === 'US' ?
      Math.max(1, Math.ceil(Math.random() * 12)) :
      Math.max(1, Math.ceil(Math.random() * 500));
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

// Generate flat hierarchichal data with n elements
export const generateFlatData = (n) => {
  const countryCodes = ['US', 'CA', 'CN', 'TW', 'IN', 'GL'];
  const postalCodes = ['pc_1', 'pc_2', 'pc_3', 'pc_4', 'pc_5', 'pc_6', 'pc_7', 'pc_8', 'pc_9', 'pc_10', 'pc_11', 'pc_12', 'pc_13'];
  const commitmentTypes = ['commitment_1', 'commitment_2', 'commitment_3', 'commitment_4', 'commitment_5'];

  const randomElem = (arr) => arr[Math.ceil(Math.random() * 100) % arr.length]

  // TODO this starts to break down when we get above a few hundred
  const numCommitments = n;
  const commitments = new Array(numCommitments);

  for (let i = 0; i < numCommitments; ++i) {
    commitments[i] = {
      name: '🌱',
      id: uuidv4(),
      commitment: randomElem(commitmentTypes),
      country: randomElem(countryCodes),
      postalCode: randomElem(postalCodes),
    };
  }

  return {
    id: uuidv4(),
    children: commitments,
  };
};

