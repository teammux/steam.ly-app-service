const AWS = require('aws-sdk');
const { MessageConfig } = require('./config.js');
const db = require('../db/index.js');
db.open();

// NOTE: These envvars must be set for Amazon SQS services to work
// AWS_ACCESS_KEY_ID
// AWS_SECRET_ACCESS_KEY
// AWS_SESSION_TOKEN (optional)
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.key.AWS_SECRET_ACCESS_KEY,
// });

AWS.config.update({ region: 'us-west-1' });

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const dbOpen = () => {
  if (!db.get()) {
    db.open();
  }
};

const dbClose = () => {
  db.close();
};

// TODO: Finish making changes here and maybe change to allow passing in attributes object as well
const sendMessage = (url, type, body) => {
  // TODO: testing just for now...
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

const sendUser = (url, userId) => {
  // db.open(url)
  //   .then(() => {
  //     db.getUserById(userId)
  //       .then((data) => {
  //         console.log('*** MY DATA:', data);
  //         // sendMessage(url, 'user', data);
  //         db.close();
  //       })
  //       .catch(() => {
  //         db.close();
  //       });
  //   })
  //   .catch(() => {
  //     // connection error
  //   });
  // db.open()
  //   .then(() => {
  //     db.getUserById(userId)
  //       .then((data) => {
  //         console.log('*** MY DATA:', data);
  //         // sendMessage(url, 'user', data);
  //         dbClose();
  //       })
  //       .catch(() => {
  //         db.close();
  //       });
  //   })
  //   .catch(() => {
  //
  //   });
  // db.open()
  //   .then(() => {
  //
  //   })
  // fetch from db
  db.getUserById(userId)
    .then((data) => {
      console.log('*** MY DATA:', data);
      // sendMessage(url, 'user', data);
    })
    .catch(() => {
    });
  // send to message url
};

const sendEvent = (url, eventId) => {
  // fetch event
  // send to message url
};

module.exports.dbOpen = dbOpen;
module.exports.dbClose = dbClose;
module.exports.sendUser = sendUser;
module.exports.sendEvent = sendEvent;
