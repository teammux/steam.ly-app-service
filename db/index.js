/* eslint no-unused-vars: ["error", { "args": "none" }] */

const { MongoClient } = require('mongodb');

const DB_HOST = process.env.STEAMLY_APP_DB_HOST || 'localhost';
const DB_PORT = process.env.STEAMLY_APP_DB_PORT || 27017;
const DB_NAME = process.env.STEAMLY_APP_DB_NAME || 'steamly-app-service';

const URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const state = {
  db: null,
};

const dropUsersCollection = () => {
  if (state.db) {
    const collection = state.db.collection('users');
    return collection.drop();
  }
  return false;
};

const insertManyUserDocuments = (documents, callback) => {
  if (state.db) {
    const collection = state.db.collection('users');

    collection.insertMany(documents, (err, result) => {
      console.log(`Inserted ${result.result.n} documents into the collection`);
      callback(result);
    });
  }
};

const insertUserDocument = (document, callback) => {
  if (state.db) {
    const collection = state.db.collection('users');

    collection.insert(document, (err, result) => {
      console.log(`Inserted ${result.result.n} document into the collection`);
      callback(result);
    });
  }
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
module.exports.insertManyUserDocuments = insertManyUserDocuments;
module.exports.insertUserDocument = insertUserDocument;
module.exports.dropUsersCollection = dropUsersCollection;
