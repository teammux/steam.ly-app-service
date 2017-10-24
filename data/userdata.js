/*
Utility script used to generate initial User data to populate a dataset
*/

const TOTAL_USER_COUNT = 1005000;

// TODO: possibly add weights based on the item
const PREFERENCE = [
  'NONE',
  'FPS',
  'ACTION',
  'RPG',
];

const LOCATION = [
  'NORTH AMERICA',
  'SOUTH AMERICA',
  'EUROPE',
  'ASIA',
  'AUSTRALIA',
  'AFRICA',
  'ANTARCTICA',
];

const AGE = {
  'startRange': 13,
  'endRange': 120,
};

const GENDER = [
  'male',
  'female',
  'declined',
];

const GENDER_RATIO = {
  'male': 45,
  'female': 45,
  'declined' 10,
};

const USERNAME_PREFIX = 'user_';

const generateWeightTable = (weightKeys) => {
  
};

class User {
  constructor(username, preference, location, age, gender) {
    this.username = username;
    this.preference = preference;
    this.location = location;
    this.age = age;
    this.gender = gender;
  }

  print() {
    console.log(
      `-----------
      username: ${this.username}
      preference: ${this.preference}
      location: ${this.location}
      age: ${this.age}
      gender: ${this.gender}
    `);
  }
};

const getRandomNumberInclusive = (begin = 0, end) => {
  return Math.floor(Math.random() * end) + begin;
}

const generateRandomListOfUsers = (listSize = TOTAL_USER_COUNT) => {
  let users = [];

  for (let i = 1; i <= listSize; i++) {
    // TODO: hoist these to be more memory-efficient
    const username = USERNAME_PREFIX + i;
    const preference = PREFERENCE[getRandomNumberInclusive(0, PREFERENCE.length - 1)];
    const location = LOCATION[getRandomNumberInclusive(0, LOCATION.length - 1)];
    const age = getRandomNumberInclusive(AGE.startRange, AGE.endRange);
    const gender = GENDER[getRandomNumberInclusive(0, GENDER.length - 1)];
    const user = new User(username, preference, location, age, gender);
    users.push();
    user.print();
  }

  return users;
}

module.exports = {
  generateRandomListOfUsers: generateRandomListOfUsers
};
