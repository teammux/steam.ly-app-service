/*
Utility script used to generate initial User data to populate a dataset
*/

const fs = require('fs');
const util = require('./util.js');

const DEFAULT_OUTPUT_FILE = 'userdata_output.txt';

const DEFAULT_TOTAL_USER_COUNT = 100;
const DEFAULT_USER_NUMBER_START = 1;

const PREFERENCE_RATIO = {
  NONE: 10,
  FPS: 29,
  ACTION: 36,
  RPG: 25,
};

// 2017 ratio percentages for continent taken from:
// https://www.statista.com/statistics/237584/distribution-of-the-world-population-by-continent/
// NOTE: rounded up to the nearest percentage point, so this will not equal 100 exactly
const LOCATION_RATIO = {
  'NORTH AMERICA': 5,
  'LATIN AMERICA AND CARIBBEAN': 9,
  EUROPE: 10,
  ASIA: 60,
  AUSTRALIA: 9,
  AFRICA: 17,
  OCEANIA: 1,
};

// 2017 ratio percentages for video gamer age range taken from:
// https://www.statista.com/statistics/189582/age-of-us-video-game-players-since-2010/
const AGE_RATIO = {
  'under 18': 29,
  '18 to 35': 27,
  '36 to 49': 19,
  'over 50': 26,
};

const GENDER_RATIO = {
  male: 45,
  female: 45,
  declined: 10,
};

const USERNAME_PREFIX = 'user_';

class User {
  constructor(id, username, preference, location, age, gender) {
    this.id = id;
    this.username = username;
    this.preference = preference;
    this.location = location;
    this.age = age;
    this.gender = gender;
  }

  print() {
    console.log(`-----------
      username: ${this.username}
      preference: ${this.preference}
      location: ${this.location}
      age: ${this.age}
      gender: ${this.gender}
    `);
  }
}

const generateRandomListOfUsers = (listSize = DEFAULT_TOTAL_USER_COUNT) => {
  const users = [];

  const PREFERENCE_RATIO_WEIGHT_TABLE = util.generateExpandedWeightTable(PREFERENCE_RATIO);
  const LOCATION_RATIO_WEIGHT_TABLE = util.generateExpandedWeightTable(LOCATION_RATIO);
  const GENDER_RATIO_WEIGHT_TABLE = util.generateExpandedWeightTable(GENDER_RATIO);
  const AGE_RATIO_WEIGHT_TABLE = util.generateExpandedWeightTable(AGE_RATIO);

  for (let i = DEFAULT_USER_NUMBER_START; i < listSize + DEFAULT_USER_NUMBER_START; i += 1) {
    // TODO: hoist these to be more memory-efficient
    const username = USERNAME_PREFIX + i;
    const preference = util.getRandomFieldValue(PREFERENCE_RATIO_WEIGHT_TABLE);
    const location = util.getRandomFieldValue(LOCATION_RATIO_WEIGHT_TABLE);
    const age = util.getRandomFieldValue(AGE_RATIO_WEIGHT_TABLE);
    const gender = util.getRandomFieldValue(GENDER_RATIO_WEIGHT_TABLE);
    const user = new User(i, username, preference, location, age, gender);
    users.push(user);
    // user.print();
  }

  return users;
};

// simple CLI
// [usage] node userdata.js <NUMBER_OF_USERS_TO_GENERATE>
if (process.argv.length > 2) {
  const cmd = process.argv[2];
  const parsedNumberCmd = parseInt(cmd, 10);
  if (Number.isInteger(parsedNumberCmd) && parsedNumberCmd > 0) {
    console.log(`generating random list of: ${parsedNumberCmd} users...`);
    const generatedUsers = generateRandomListOfUsers(parsedNumberCmd);

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
    Utility script used to generate initial User data to populate a dataset.

    Results are placed in an 'output.txt' file.

      [usage] node userdata.js <NUMBER_OF_USERS_TO_GENERATE>
    `);
}

module.exports.generateRandomListOfUsers = generateRandomListOfUsers;
