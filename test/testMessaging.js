/* global describe, it */

const assert = require('assert');
const messaging = require('../messaging/index.js');

describe('steam.ly - messaging', () => {
  describe('API', () => {
    it('"sendUser and "sendEvent" should exist', () => {
      assert(messaging.sendUser);
      assert(messaging.sendEvent);
    });
  });
});
