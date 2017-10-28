const express = require('express');
const metrics = require('../metrics/index.js');

const app = express();

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
  response.status(400).send('OHAI I AM A SERVER');
});

// start the server
app.set('port', process.env.PORT || 3498);
app.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`);
});
