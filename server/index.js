const process = require('process');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const metrics = require('../metrics/index.js');
const messaging = require('../messaging/index.js');
const db = require('../db/index.js');

const app = express();

app.use(bodyParser.json());

let ServerInstance = null;

app.get('/user/:id', (request, response) => {
  const userId = parseInt(request.params.id, 10);
  if (Number.isInteger(userId)) {
    db.getUserById(userId)
      .then((data) => {
        response.status(200).send(data);
      })
      .catch((error) => {
        response.status(404).send(error);
      });
  } else {
    response.status(404).send();
  }
});

app.post('/event', (request, response) => {
  if (!request.body) {
    response.status(400).send();
  }
  // console.log('body:', request.body);
  const eventRequestData = request.body;
  const event = {};
  if (eventRequestData && eventRequestData.type === 'click') {
    event.type = eventRequestData.type;
    event.user = {
      id: eventRequestData.userId,
      date: eventRequestData.date,
      content: {
        game_id: eventRequestData.content.gameId,
        is_recommended_game: eventRequestData.content.isRecommendedGame,
      },
    };

    // dispatch our event here
    metrics.createEvent(event);
    // NOTE: we are only sending clicks to the EventService for now
    messaging.sendEventToEventService(
      event.user.id,
      event.type,
      event.user.content.is_recommended_game,
      event.user.date
    );
    response.status(200).send();
  } else if (eventRequestData && eventRequestData.type === 'view') {
    event.type = eventRequestData.type;
    event.user = {
      id: eventRequestData.userId,
      date: eventRequestData.date,
      content: {
        game_id_list: eventRequestData.content.gameIdList,
      },
    };
    // dispatch our event here
    metrics.createEvent(event);
    // NOTE: we are only sending clicks to the EventService for now
    // messaging.sendEventToEventService(
    //   event.user.id,
    //   event.type,
    //   event.user.content.is_recommended_game,
    //   event.user.date
    // );
    response.status(200).send();
  } else {
    // we received a bad type
    response.status(400).send();
  }
});

const startServer = () => {
  console.log('starting server...');
  app.set('port', process.env.STEAMLY_SERVER_PORT || 3498);
  ServerInstance = app.listen(app.get('port'), () => {
    console.log(`listening on port ${app.get('port')}`);
  });
  messaging.start();
};

const stopServer = () => {
  console.log('shutting down server...');
  if (ServerInstance) {
    ServerInstance.close();
  }
  messaging.stop();
};

const displayUsage = () => {
  console.log(`
    Script used to start the app-service server

      [usage] node ${path.basename(__filename)} start
    `);
};

// simple CLI
// [usage] node server/index.js start
if (process.argv.length > 2) {
  const cmd = process.argv[2];
  if (cmd === 'start') {
    console.log('starting server...');
    startServer();
  } else if (cmd === 'stop') {
    console.log('stopping server...');
  } else {
    displayUsage();
  }
} else {
  displayUsage();
}

module.exports.start = startServer;
module.exports.stop = stopServer;
