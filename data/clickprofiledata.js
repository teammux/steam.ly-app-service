/*
Utility script used to generate initial Click Profile data to populate a dataset
*/

const fs = require('fs');
const util = require('./util.js');

const DEFAULT_OUTPUT_FILE = 'clickprofiledata_output.txt';

const DEFAULT_TOTAL_USER_COUNT = 100;
const DEFAULT_USER_NUMBER_START = 1;

const PREFERENCE_VALUES = [
  'NONE',
  'FPS',
  'ACTION',
  'RPG',
];

const ITEM_IMPRESSIONS_RANGE = {
  start: 0,
  end: 200000,
};

class ClickProfileItem {
  constructor(category, impressionCount, recommendedClickCount, randomClickCount) {
    this.category = category;
    this.impressionCount = impressionCount;
    this.recommendedClickCount = recommendedClickCount;
    this.randomClickCount = randomClickCount;
  }
}

class ClickProfile {
  constructor(
    userId,
    totalImpressions = 0,
    totalRecommendedClickCount = 0,
    totalRandomClickCount = 0
  ) {
    this.userId = userId;
    this.totalImpressions = totalImpressions;
    this.totalRecommendedClickCount = totalRecommendedClickCount;
    this.totalRandomClickCount = totalRandomClickCount;
    this.clickProfileItems = [];
  }

  addClickProfileItem(item) {
    this.clickProfileItems.push(item);
  }

  print() {
    console.log(`-----------
      userid: ${this.userId}
      totalRecommendedClickCount: ${this.totalRecommendedClickCount}
      totalRandomClickCount: ${this.totalRandomClickCount}
    `);
  }
}

const generateRandomListOfClickProfileData = (listSize = DEFAULT_TOTAL_USER_COUNT) => {
  const clickProfileDataList = [];
  for (let i = DEFAULT_USER_NUMBER_START; i < listSize + DEFAULT_USER_NUMBER_START; i += 1) {
    // create the click profile data here
    let totalImpressions = 0;
    let totalRecommendedClickCount = 0;
    let totalRandomClickCount = 0;
    const clickProfile = new ClickProfile(i);

    for (let j = 0; j < PREFERENCE_VALUES.length; j += 1) {
      // add in the click profile data items as well for each enumeration
      const impressionCount =
        util.getRandomNumberInclusive(ITEM_IMPRESSIONS_RANGE.start, ITEM_IMPRESSIONS_RANGE.end);
      const recommendedClickCount =
        util.getRandomNumberInclusive(ITEM_IMPRESSIONS_RANGE.start, impressionCount);
      const randomClickCount =
        util.getRandomNumberInclusive(
          ITEM_IMPRESSIONS_RANGE.start,
          impressionCount - recommendedClickCount
        );

      // keep summing values for the running total used in ClickProfile
      totalImpressions += impressionCount;
      totalRecommendedClickCount += recommendedClickCount;
      totalRandomClickCount += randomClickCount;

      const clickProfileItem =
        new ClickProfileItem(
          PREFERENCE_VALUES[j],
          impressionCount,
          recommendedClickCount,
          randomClickCount
        );
      // add our new ClickProfileItem to the main ClickProfile
      clickProfile.addClickProfileItem(clickProfileItem);
    }

    // new ClickProfile(i, totalImpressions, totalRecommendedClickCount, totalRandomClickCount);
    clickProfile.totalImpressions = totalImpressions;
    clickProfile.totalRecommendedClickCount = totalRecommendedClickCount;
    clickProfile.totalRandomClickCount = totalRandomClickCount;

    clickProfileDataList.push(clickProfile);
  }

  return clickProfileDataList;
};

// simple CLI
// [usage] node clickprofiledata.js <NUMBER_OF_USER_CLICK_PROFILES_TO_GENERATE>
if (process.argv.length > 2) {
  const cmd = process.argv[2];
  const parsedNumberCmd = parseInt(cmd, 10);
  if (Number.isInteger(parsedNumberCmd) && parsedNumberCmd > 0) {
    console.log(`generating random list of: ${parsedNumberCmd} users...`);
    const generatedUsers = generateRandomListOfClickProfileData(parsedNumberCmd);

    // TODO: add option to specify an alternate output_file_name
    fs.writeFile(DEFAULT_OUTPUT_FILE, JSON.stringify(generatedUsers), (err) => {
      if (err) {
        console.error('error detected:', err);
        return;
      }
      console.log('--> successfully created file at:', DEFAULT_OUTPUT_FILE);
      console.log('done!');
    });
  }
} else {
  console.log(`
    Utility script used to generate initial Click Profile data to populate a dataset.

    Results are placed in an '${DEFAULT_OUTPUT_FILE}' file.

      [usage] node ${__filename} <NUMBER_OF_USERS_TO_GENERATE>

        NUMBER_OF_USERS_TO_GENERATE: Limit to 500k per run
    `);
}

module.exports.generateRandomListOfClickProfileData = generateRandomListOfClickProfileData;
