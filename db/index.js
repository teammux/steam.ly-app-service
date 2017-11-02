/* eslint no-unused-vars: ["error", { "args": "none" }] */

const { MongoClient } = require('mongodb');

const DB_HOST = process.env.STEAMLY_APP_DB_HOST || 'localhost';
const DB_PORT = process.env.STEAMLY_APP_DB_PORT || 27017;
const DB_NAME = process.env.STEAMLY_APP_DB_NAME || 'steamly-app-service';

const URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const state = {
  db: null,
};

const dropUsers = () => {
  if (state.db) {
    const collection = state.db.collection('users');
    return collection.drop();
  }
  return false;
};

const insertManyUsers = (documents, callback) => {
  if (state.db) {
    const collection = state.db.collection('users');

    collection.insertMany(documents, (err, result) => {
      console.log(`Inserted ${result.result.n} documents into the collection`);
      callback(result);
    });
  }
};

const insertUser = (document, callback) => {
  if (state.db) {
    const collection = state.db.collection('users');

    collection.insert(document, (err, result) => {
      console.log(`Inserted ${result.result.n} document into the collection`);
      callback(result);
    });
  }
};

const getUserById = (userId, callback) => {
  const collection = state.db.collection('users');
  collection.find({ _id: userId }).next()
    .then((data) => {
      // console.log('*** data:', data);
      callback(data);
    })
    .catch((error) => {
      // console.log('*** error:', error);
      callback(null);
    });
};

const getUsers = (callback) => {
  const collection = state.db.collection('users');
  collection.find().limit(5).toArray()
    .then((data) => {
      // console.log('*** getUsers data:', data);
      callback(data);
    })
    .catch((error) => {
      // console.log('*** getUsers error:', error);
      callback(null);
    });
};

const connect = (url = URL) => {
  if (state.db) {
    console.log('already connected to database');
    return state.db;
  }

  MongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('error connecting to database:', err);
      return null;
    }
    state.db = db;
    console.log('successfully connected to database');
    return state.db;
  });
  return state.db;
};

const get = () => state.db;

const close = (done = null) => {
  if (state.db) {
    state.db.close((err, result) => {
      state.db = null;
      state.mode = null;
      if (done) {
        done(err);
      }
    });
  }
};

module.exports.open = connect;
module.exports.get = get;
module.exports.close = close;
module.exports.insertManyUsers = insertManyUsers;
module.exports.insertUser = insertUser;
module.exports.getUserById = getUserById;
module.exports.getUsers = getUsers;
module.exports.dropUsers = dropUsers;
