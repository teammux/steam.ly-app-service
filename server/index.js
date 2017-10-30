const process = require('process');
const path = require('path');
const express = require('express');
const metrics = require('../metrics/index.js');

const app = express();

let ServerInstance = null;

let EventIdCounter = 1;

app.post('/event', (request, response) => {
  const event = {
    id: EventIdCounter,
    type: 'click',
    user: {
      id: 1,
      date: Date.now(),
      content: {
        hello: 'world',
      },
    },
  };
  EventIdCounter += 1;
  metrics.createEvent(event);
  response.status(400).send();
});

const startServer = () => {
  console.log('starting server...');
  app.set('port', process.env.STEAMLY_SERVER_PORT || 3498);
  ServerInstance = app.listen(app.get('port'), () => {
    console.log(`listening on port ${app.get('port')}`);
  });
};

const stopServer = () => {
  console.log('shutting down server...');
  if (ServerInstance) {
    ServerInstance.close();
  }
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
