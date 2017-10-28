const elasticsearch = require('elasticsearch');

const LOG_TAG = 'steam.ly';
const MODULE_NAME = 'metrics';

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

client.ping({
  requestTimeout: 30000,
}, (error) => {
  if (error) {
    console.log(`[${LOG_TAG} - ${MODULE_NAME}] elasticsearch cluster is down`);
  } else {
    console.log(`[${LOG_TAG} - ${MODULE_NAME}] elasticsearch server now running...`);
  }
});

const createEvent = (event) => {
  client.create({
    index: 'user',
    type: event.type,
    id: event.id,
    body: {
      user_id: event.user.id,
      date: event.user.date,
      data: event.user.content,
    },
  }, (error, response) => {
    if (error) {
      console.log('createEvent error:', error);
    }
    if (response) {
      // do something
    }
  });
};

module.exports.createEvent = createEvent;
