/*
Utility script used to simulate real-time User Events
*/

const nodeUtil = require('util');
const path = require('path');
const axios = require('axios');
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
  random: 35,
  recommended: 65,
};

// TODO: there's a better way to do this...maybe through a property
const RECOMMEND_CLICKTHROUGH_MAP = {
  random: 0,
  recommended: 1,
};

// provide the chance of no click at all
const CLICK_PROBABILITY = 0.75;

const config = {
  // user
  numOfUsers: DEFAULT.NUM_USERS,
  userIdStart: DEFAULT.USER_ID_START,
  // game
  numOfGames: DEFAULT.NUM_GAMES,
  gameIdStart: DEFAULT.GAME_ID_START,

  // http
  http: {
    baseURL: process.env.STEAMLY_SERVER_URL || 'localhost',
    port: process.env.STEAMLY_SERVER_PORT || 3498,
    eventEndpoint: '/event',
  },
};

const postURL = `http://${config.http.baseURL}:${config.http.port}${config.http.eventEndpoint}`;

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
  let recommendedGameId;
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
  const userViewEvent = new UserEvent(
    'view',
    randomUserId,
    CurrentSimTime,
    {
      gameIdList: [],
    }
  );
  for (let i = 0; i < burstQuantity; i += 1) {
    randomUserId = util.getRandomNumberInclusive(config.userIdStart, config.numOfUsers);
    randomGameId = util.getRandomNumberInclusive(config.gameIdStart, config.numOfGames);
    recommendedGameId = util.getRandomNumberInclusive(config.gameIdStart, config.numOfGames);
    randomIsRecommendedGame =
      RECOMMEND_CLICKTHROUGH_MAP[
        util.getRandomFieldValue(RECOMMEND_CLICKTHROUGH_RATIO_WEIGHT_TABLE)];

    // reset the values of the object to be more memory efficient
    userViewEvent.type = 'view';
    userViewEvent.userId = randomUserId;
    userViewEvent.date = CurrentSimTime;
    userViewEvent.content = {
      gameIdList: [recommendedGameId, randomGameId],
    };

    // notify the view impression
    axios.post(postURL, {
      type: userViewEvent.type,
      date: userViewEvent.date,
      userId: userViewEvent.userId,
      content: userViewEvent.content,
    })
      .catch(error => console.log('error posting event:', error));

    // reset the values of the object to be more memory efficient
    // TODO: differentiate the sim time between the view and click
    if (Math.random() <= CLICK_PROBABILITY) {
      userEvent.type = 'click';
      userEvent.userId = randomUserId;
      userEvent.date = CurrentSimTime;
      userEvent.content = {
        gameId: (randomIsRecommendedGame) ? recommendedGameId : randomGameId,
        isRecommendedGame: randomIsRecommendedGame,
      };

      // notify the click
      axios.post(postURL, {
        type: userEvent.type,
        date: userEvent.date,
        userId: userEvent.userId,
        content: userEvent.content,
      })
        .catch(error => console.log('error posting event:', error));
    }
  }
};

const startSimulation =
  (burstRate = DEFAULT.BURST_RATE, burstQuantity = DEFAULT.BURST_QUANTITY) => {
    setInterval(() => generateRandomUserEvent(burstRate, burstQuantity), burstRate);
  };

const displayUsage = () => {
  console.log(`
    Utility script used to simulate real-time User Events and is meant to be started and run in the background

      [usage] node ${path.basename(__filename)} <EVENT_BURST_INTERVAL> <EVENT_BURST_QUANTITY>

        EVENT_BURST_INTERVAL: interval in milliseconds to send a batch of events

        EVENT_BURST_QUANTITY: amount of events to send at each burst interval
    `);
};

// simple CLI
// [usage] node index.js <EVENT_BURST_INTERVAL> <EVENT_BURST_QUANTITY>
if (process.argv.length > 1) {
  const burstIntervalArg = process.argv[2] || DEFAULT.BURST_RATE;
  const burstQuantityArg = process.argv[3] || DEFAULT.BURST_QUANTITY;
  const parsedburstIntervalArg = parseInt(burstIntervalArg, 10);
  const parsedburstQuantityArg = parseInt(burstQuantityArg, 10);

  if (burstIntervalArg === '?') {
    displayUsage();
  }
  // validate our inputs
  if (Number.isInteger(parsedburstIntervalArg)
    && parsedburstIntervalArg > 0
    && Number.isInteger(parsedburstQuantityArg)
    && parsedburstQuantityArg > 0
  ) {
    console.log(`CONFIG:
      burstInterval: ${parsedburstIntervalArg}
      burstQuantity: ${parsedburstQuantityArg}
      `);

    // initiate our simulation event loop
    console.log('starting user event simulation...');
    startSimulation(parsedburstIntervalArg, parsedburstQuantityArg);
  }
} else {
  displayUsage();
}
