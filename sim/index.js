/*
Utility script used to simulate real-time User Events
*/

const nodeUtil = require('util');
const util = require('../util/util.js');

const DEFAULT = {
  BURST_RATE: 1000,
  BURST_QUANTITY: 500,
  NUM_USERS: 2000000,
  USER_ID_START: 1,
  NUM_GAMES: 10000000,
  GAME_ID_START: 1,
};

// initial start time
// 1483228800000
// 2017-01-01T00:00:00.000Z
const START_DATE = new Date(Date.UTC(2017, 0, 1, 0, 0, 0, 0));
const START_DATE_MS = START_DATE.getTime();

const RECOMMEND_CLICKTHROUGH_RATIO = {
  random: 65,
  recommended: 35,
};

// TODO: there's a better way to do this...maybe through a property
const RECOMMEND_CLICKTHROUGH_MAP = {
  random: 0,
  recommended: 1,
};

const config = {
  // user
  numOfUsers: DEFAULT.NUM_USERS,
  userIdStart: DEFAULT.USER_ID_START,
  // game
  numOfGames: DEFAULT.NUM_GAMES,
  gameIdStart: DEFAULT.GAME_ID_START,
};

// this is essentially the RTC for the simulation and is the source of truth
// for all event times
let CurrentSimTime = START_DATE_MS;

class UserEvent {
  constructor(type, userId, date, content = null) {
    this.type = type;
    this.userId = userId;
    this.date = date;
    this.content = content;
  }
  print() {
    console.log(`-----------
      type: ${this.type}
      userId: ${this.userId}
      date: ${this.date}
      content: ${nodeUtil.inspect(this.content, { showHidden: false, depth: null })}
    `);
  }
}

const generateRandomUserEvent = (burstIntervalRate, burstQuantity) => {
  let randomUserId;
  let randomGameId;
  let randomIsRecommendedGame;

  const RECOMMEND_CLICKTHROUGH_RATIO_WEIGHT_TABLE =
    util.generateExpandedWeightTable(RECOMMEND_CLICKTHROUGH_RATIO);

  CurrentSimTime += burstIntervalRate;

  // init the object with something just so we can change properties later
  // and not have to recreate the object
  const userEvent = new UserEvent(
    'click',
    randomUserId,
    CurrentSimTime,
    {
      gameId: randomGameId,
      isRecommendedGame: randomIsRecommendedGame,
    }
  );
  for (let i = 0; i < burstQuantity; i += 1) {
    randomUserId = util.getRandomNumberInclusive(config.userIdStart, config.numOfUsers);
    randomGameId = util.getRandomNumberInclusive(config.gameIdStart, config.numOfGames);
    randomIsRecommendedGame =
      RECOMMEND_CLICKTHROUGH_MAP[
        util.getRandomFieldValue(RECOMMEND_CLICKTHROUGH_RATIO_WEIGHT_TABLE)];

    // reset the values of the object to be more memory efficient
    userEvent.type = 'click';
    userEvent.userId = randomUserId;
    userEvent.date = CurrentSimTime;
    userEvent.content = {
      gameId: randomGameId,
      isRecommendedGame: randomIsRecommendedGame,
    };
    // dispatch the event here
    userEvent.print();
  }
};

const startSimulation =
  (burstRate = DEFAULT.BURST_RATE, burstQuantity = DEFAULT.BURST_QUANTITY) => {
    setInterval(() => generateRandomUserEvent(burstRate, burstQuantity), burstRate);
  };

// initiate our simulation event loop
startSimulation();
