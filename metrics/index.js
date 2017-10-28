const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

client.ping({
  requestTimeout: 30000,
}, (error) => {
  if (error) {
    console.log('elasticsearch cluster is down');
  } else {
    console.log('all is well');
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
  });
};

module.exports.createEvent = createEvent;
