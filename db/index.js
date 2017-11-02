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

const open = (url = URL) => {
  if (state.db) {
    console.log('already connected to database');
    return state.db;
  }

  return new Promise((resolve, reject) => {
    MongoClient.connect(url)
      .then((db) => {
        console.log('successfully connected to database');
        state.db = db;
        resolve(state.db);
      })
      .catch((err) => {
        console.log('error connecting to database:', err);
        reject(err);
      });
  });

  // return MongoClient.connect(url)
  // MongoClient.connect(url)
  //   .then((db) => {
  //     console.log('successfully connected to database');
  //     state.db = db;
  //   })
  //   .catch((err) => {
  //     console.log('error connecting to database:', err);
  //   });
  // if (err) {
  //   console.log('error connecting to database:', err);
  //   return null;
  // }
  //   state.db = db;
  //   console.log('successfully connected to database');
  //   return state.db;
  // });
  return state.db;
};

// const open = (url = URL) => {
//   if (state.db) {
//     console.log('already connected to database');
//     return state.db;
//   }
//
//   MongoClient.connect(url, (err, db) => {
//     if (err) {
//       console.log('error connecting to database:', err);
//       return null;
//     }
//     state.db = db;
//     console.log('successfully connected to database');
//     return state.db;
//   });
//   return state.db;
// };

const get = () => state.db;
const close = () => state.db.close();

module.exports.open = open;
module.exports.get = get;
module.exports.close = close;
module.exports.insertManyUsers = insertManyUsers;
module.exports.insertUser = insertUser;
module.exports.getUserById = getUserById;
module.exports.getUsers = getUsers;
module.exports.dropUsers = dropUsers;
