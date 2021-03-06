/* global describe, it, xit, before, after, beforeEach */
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_id"] }] */

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
    db.dropUsers()
      .then(() => {
      })
      .catch(() => {
      });
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
        _id: 1, username: 'user_1', preference: 'FPS', location: 'ASIA', age: 'over 50', gender: 'male',
      },
      {
        _id: 2, username: 'user_2', preference: 'FPS', location: 'AUSTRALIA', age: '18 to 35', gender: 'male',
      },
      {
        _id: 3, username: 'user_3', preference: 'RPG', location: 'ASIA', age: '18 to 35', gender: 'female',
      },
      {
        _id: 4, username: 'user_4', preference: 'FPS', location: 'EUROPE', age: '36 to 49', gender: 'male',
      },
      {
        _id: 5, username: 'user_5', preference: 'RPG', location: 'AUSTRALIA', age: '36 to 49', gender: 'female',
      },
    ];

    it('database should be able to insert a single document', (done) => {
      const TEST_SINGLE_USER_DATA = {
        _id: 1, username: 'test_user3456', preference: 'FPS', location: 'ASIA', age: 'over 50', gender: 'male',
      };
      db.insertUser(TEST_SINGLE_USER_DATA)
        .then((result) => {
          assert(result);
          assert(result.result.ok);
          assert(result.result.n === 1);
          done();
        })
        .catch(() => {
          done();
        });
    });

    it('database should be able to insert many documents at a time', (done) => {
      db.insertManyUsers(TEST_USER_DATA)
        .then((result) => {
          assert(result);
          assert(result.result.ok);
          assert(result.result.n === 5);
          done();
        })
        .catch(() => {
          done();
        });
    });

    it('database should be able to get a user by id', (done) => {
      const GET_USER_ID = 1;
      const TEST_SINGLE_USER_DATA = {
        _id: GET_USER_ID, username: 'test_user3456', preference: 'FPS', location: 'ASIA', age: 'over 50', gender: 'male',
      };
      db.insertUser(TEST_SINGLE_USER_DATA)
        .then((result) => {
          assert(result);
          assert(result.result.ok);
          assert(result.result.n === 1);

          db.getUserById(GET_USER_ID)
            .then((data) => {
              assert(data);
              assert(data._id === GET_USER_ID);
              done();
            })
            .catch(() => {
              done();
            });
        })
        .catch(() => {
          done();
        });
    });

    xit('insertUsers should clear the collection', (done) => {
      db.dropUsers()
        .then((data) => {
          assert(data);
          done();
        })
        .catch(() => {
          done();
        });
    });
  });

  after(() => {
    db.close();
  });
});
