const AWS = require('aws-sdk');
const { MessageConfig } = require('./config.js');

// NOTE: These envvars must be set for Amazon SQS services to work
// AWS_ACCESS_KEY_ID
// AWS_SECRET_ACCESS_KEY
// AWS_SESSION_TOKEN (optional)
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.key.AWS_SECRET_ACCESS_KEY,
// });

const TEST_QUEUE_URL = MessageConfig.test;

AWS.config.update({ region: 'us-west-1' });

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

// TODO: maybe change to allow passing in attributes object as well
const sendMessage = (url, type, body) => {
  const params = {
    MessageAttributes: {
      Type: {
        DataType: 'String',
        StringValue: type,
      },
      Date: {
        DataType: 'String',
        StringValue: Date.now().toString(),
      },
      UserId: {
        DataType: 'String',
        StringValue: 'user_12',
      },
    },
    MessageBody: JSON.stringify(body),
    QueueUrl: url,
  };
  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.MessageId);
      }
    });
  });
};

sendMessage(
  TEST_QUEUE_URL,
  'click',
  {
    UserId: 'user_97',
    GameId: 'game_123',
    isRecommendedGame: true,
  }
);

const receiveMessage = (url) => {
  const receiveParams = {
    AttributeNames: [
      'SentTimestamp',
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
      'All',
    ],
    QueueUrl: url,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0,
  };

  return new Promise((resolve, reject) => {
    sqs.receiveMessage(receiveParams, (err, data) => {
      if (err) {
        // console.log('Receive Error', err);
        reject(err);
      } else {
        // console.log('Received:', data);
        resolve(data);
        // delete it too!
        const deleteParams = {
          QueueUrl: url,
          ReceiptHandle: data.Messages[0].ReceiptHandle,
        };
        sqs.deleteMessage(deleteParams, (deleteErr, deleteData) => {
          if (deleteErr) {
            console.log('Delete Error', deleteErr);
            // reject(deleteErr);
          } else {
            console.log('Message Deleted', deleteData);
            // resolve(deleteData);
          }
        });
      }
    });
  });
};

receiveMessage(TEST_QUEUE_URL)
  .then((data) => {
    console.log('received message:', data);
  })
  .catch((error) => {
    console.log('received message error:', error);
  });
