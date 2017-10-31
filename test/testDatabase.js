/* global describe, it, before, after */
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

  describe('connection', () => {
    it('database client interface should be able to connect to underlying database', (done) => {
      assert(db.get() !== null);
      done();
    });
  });

  after(() => {
    db.close();
  });
});
