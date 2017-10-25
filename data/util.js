/*
Utility functions necessary for simulated data generation
*/

// use a quick-and-dirty weighted randomizer with expansion
// this is quick and okay so long as our totalWeights isn't astronomically large
const generateExpandedWeightTable = (weightKeys) => {
  const expandedWeightList = [];

  const keys = Object.keys(weightKeys);
  for (let k = 0; k < keys.length; k += 1) {
    for (let i = 0; i < weightKeys[keys[k]]; i += 1) {
      expandedWeightList[expandedWeightList.length] = keys[k];
    }
  }

  return expandedWeightList;
};

const getRandomNumberInclusive = (begin = 0, end) => Math.floor(Math.random() * end) + begin;

const getRandomFieldValue =
  weightTable => weightTable[getRandomNumberInclusive(0, weightTable.length)];

module.exports.generateExpandedWeightTable = generateExpandedWeightTable;
module.exports.getRandomNumberInclusive = getRandomNumberInclusive;
module.exports.getRandomFieldValue = getRandomFieldValue;
