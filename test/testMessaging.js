/* global describe, before, after, it */
const assert = require('assert');
const messaging = require('../messaging/index.js');

describe('steam.ly - messaging', () => {
  before(() => {
    messaging.dbOpen();
  });

  describe('API', () => {
    it('"sendUser and "sendEvent" should exist', () => {
      assert(messaging.sendUser);
      assert(messaging.sendEvent);
    });
  });

  after(() => {
    messaging.dbClose();
  });
});
