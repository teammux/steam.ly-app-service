/* eslint no-unused-vars: ["error", { "args": "none" }] */

const { MongoClient } = require('mongodb');

const DB_HOST = process.env.STEAMLY_APP_DB_HOST || 'localhost';
const DB_PORT = process.env.STEAMLY_APP_DB_PORT || 27017;
const DB_NAME = process.env.STEAMLY_APP_DB_NAME || 'steamly-app-service';

const URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// keep track of the current db state
const state = {
  db: null,
};

const dropUsers = () => {
  const collection = state.db.collection('users');
  return collection.drop();
};

const insertManyUsers = (documents) => {
  const collection = state.db.collection('users');
  return collection.insertMany(documents);
};

const insertUser = (document) => {
  const collection = state.db.collection('users');
  return collection.insert(document);
};

const getUserById = (userId) => {
  const collection = state.db.collection('users');
  return collection.find({ _id: userId }).next();
};

const getUsers = (limit = 10) => {
  const collection = state.db.collection('users');
  return collection.find().limit(limit).toArray();
};

const connect = (url = URL) => (
  new Promise((resolve, reject) => {
    MongoClient.connect(url)
      .then((db) => {
        state.db = db;
        resolve(state.db);
      })
      .catch((err) => {
        reject(err);
      });
  })
);

const open = (url = URL) => {
  // establish our connection, if needed
  if (!state.db) {
    state.db = (async () => {
      await connect(URL)
        .then((connection) => {
          console.log('successfully connected to database');
        })
        .catch((error) => {
          console.log('error connecting to database:', error);
        });
      return state.db;
    })();
  }
  return state.db;
};

const get = () => state.db;
const close = () => {
  if (state.db) {
    state.db.close();
  }
};

// establish our connection
// using async/await here to prevent race condition when first making connection
(async () => {
  state.db = await open(URL);
  module.exports.connection = state.db;
})();

module.exports.connection = state.db;
module.exports.open = open;
module.exports.get = get;
module.exports.close = close;
module.exports.insertManyUsers = insertManyUsers;
module.exports.insertUser = insertUser;
module.exports.getUserById = getUserById;
module.exports.getUsers = getUsers;
module.exports.dropUsers = dropUsers;
