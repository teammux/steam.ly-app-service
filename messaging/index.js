/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const AWS = require('aws-sdk');
const db = require('../db/index.js');

// TODO: maybe move this into a config
const SERVICE_NAME = 'app-service';

// NOTE: These envvars must be set for Amazon SQS services to work
// AWS_ACCESS_KEY_ID
// AWS_SECRET_ACCESS_KEY
// AWS_SESSION_TOKEN (optional)
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.key.AWS_SECRET_ACCESS_KEY,
// });

// do AWS setup
// TODO: maybe move this to a config
AWS.config.update({ region: 'us-west-1' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const sendUser = (url, userId, isFifo = false) => {
  // fetch from db
  db.getUserById(userId)
    .then((data) => {
      const userBody = {
        id: data._id,
        username: data.username,
        preference: data.preference,
        location: data.location,
        age: data.age,
        gender: data.gender,
      };

      const params = {
        MessageAttributes: {
          Type: {
            DataType: 'String',
            StringValue: 'user',
          },
          Date: {
            DataType: 'String',
            StringValue: Date.now().toString(),
          },
          UserId: {
            DataType: 'String',
            StringValue: userId.toString(),
          },
        },
        MessageBody: JSON.stringify(userBody),
        QueueUrl: url,
      };

      // additional params for FIFO queues
      if (isFifo) {
        params.MessageGroupId = SERVICE_NAME;
        params.MessageDeduplicationId = SERVICE_NAME;
      }

      sqs.sendMessage(params, (err, messageData) => {
        if (err) {
          console.log('error sending message:', err);
        } else {
          console.log('send message:', messageData.MessageId);
        }
      });
    })
    .catch(() => {
    });
  // send to message url
};

const sendEvent = (url, eventId, messageBody = {}, isFifo = false) => {
  const params = {
    MessageAttributes: {
      Type: {
        DataType: 'String',
        StringValue: 'user',
      },
      Date: {
        DataType: 'String',
        StringValue: Date.now().toString(),
      },
      EventId: {
        DataType: 'String',
        StringValue: eventId.toString(),
      },
    },
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: url,
  };

  // additional params for FIFO queues
  if (isFifo) {
    params.MessageGroupId = SERVICE_NAME;
    params.MessageDeduplicationId = SERVICE_NAME;
  }

  sqs.sendMessage(params, (err, messageData) => {
    if (err) {
      console.log('error sending message:', err);
    } else {
      console.log('send message:', messageData.MessageId);
    }
  });
};

module.exports.sendUser = sendUser;
module.exports.sendEvent = sendEvent;
