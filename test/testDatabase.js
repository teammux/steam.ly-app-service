/* global describe, it, before, after, beforeEach */
const assert = require('assert');
const db = require('../db/index.js');

const config = {
  baseURL: process.env.STEAMLY_TEST_DB_SERVER_URL || '127.0.0.1',
  port: process.env.STEAMLY_TEST_DB_SERVER_PORT || 27017,
  // NOTE: using a different database strictly for testing to avoid
  // modifying the original
  dbName: 'steamly-app-server-test',
};
const URL = `mongodb://${config.baseURL}:${config.port}/${config.dbName}`;

describe('steam.ly - database', () => {
  before(() => {
    db.open(URL);
  });

  beforeEach(() => {
    db.dropUsersCollection();
  });

  describe('connection', () => {
    it('database client interface should be able to connect to underlying database', (done) => {
      assert(db.get() !== null);
      done();
    });
  });

  describe('API', () => {
    const TEST_USER_DATA = [
      {
        id: 1, username: 'user_1', preference: 'FPS', location: 'ASIA', age: 'over 50', gender: 'male',
      },
      {
        id: 2, username: 'user_2', preference: 'FPS', location: 'AUSTRALIA', age: '18 to 35', gender: 'male',
      },
      {
        id: 3, username: 'user_3', preference: 'RPG', location: 'ASIA', age: '18 to 35', gender: 'female',
      },
      {
        id: 4, username: 'user_4', preference: 'FPS', location: 'EUROPE', age: '36 to 49', gender: 'male',
      },
      {
        id: 5, username: 'user_5', preference: 'RPG', location: 'AUSTRALIA', age: '36 to 49', gender: 'female',
      },
    ];

    it('database should be able to insert a single document', (done) => {
      const TEST_SINGLE_USER_DATA = {
        id: 1, username: 'test_user3456', preference: 'FPS', location: 'ASIA', age: 'over 50', gender: 'male',
      };
      db.insertUserDocument(TEST_SINGLE_USER_DATA, (result) => {
        assert(result);
        assert(result.result.ok);
        assert(result.result.n === 1);
        done();
      });
    });

    it('database should be able to insert many documents at a time', (done) => {
      db.insertManyUserDocuments(TEST_USER_DATA, (result) => {
        assert(result);
        assert(result.result.ok);
        assert(result.result.n === 5);
        done();
      });
    });

    it('insertUserDocuments should clear the collection', (done) => {
      assert(db.dropUsersCollection());
      done();
    });
  });

  after(() => {
    db.close();
  });
});
