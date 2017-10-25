/*
Utility functions necessary for simulated data generation
*/

// use a quick-and-dirty weighted randomizer with expansion
// this is quick and okay so long as our totalWeights isn't astronomically large
const generateExpandedWeightTable = (weightKeys) => {
  let expandedWeightList = [];

  for (let key in weightKeys) {
    for (let i = 0; i < weightKeys[key]; i++) {
      expandedWeightList[expandedWeightList.length++] = key;
    }
  }

  return expandedWeightList;
};

const getRandomNumberInclusive = (begin = 0, end) => {
  return Math.floor(Math.random() * end) + begin;
}

const getRandomFieldValue = (weightTable) => {
  return weightTable[getRandomNumberInclusive(0, weightTable.length)];
};

module.exports = {
  generateExpandedWeightTable: generateExpandedWeightTable,
  getRandomNumberInclusive: getRandomNumberInclusive,
  getRandomFieldValue: getRandomFieldValue,
}
