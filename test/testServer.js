/* global describe, it, before, after */

const assert = require('assert');
const axios = require('axios');
const server = require('../server/index.js');

const STEAMLY_TEST_PORT = 3498;

const config = {
  baseURL: process.env.STEAMLY_TEST_SERVER_URL || 'localhost',
  port: process.env.STEAMLY_TEST_SERVER_PORT || STEAMLY_TEST_PORT,
  eventEndpoint: '/event',
};

describe('steam.ly - server', () => {
  before(() => {
    server.start();
  });

  describe('/event', () => {
    const postURL = `http://${config.baseURL}:${config.port}${config.eventEndpoint}`;

    it('should return an error with an invalid event type', (done) => {
      const invalidEventType = {
        type: 'moo',
        date: Date.now(),
        userId: 1,
        content: {
          game_id: 1,
          is_recommended_game: 1,
        },
      };

      axios.post(postURL, invalidEventType)
        .then((resolve) => {
          // console.log('resolve:', resolve);
          // false, if it resolved
          assert(false);
          done();
        })
        .catch((error) => {
          // true, if it did not resolve - expected
          assert(error);
          done();
        });
    });

    it('should succeed with a valid "click" event', (done) => {
      const userClickEvent = {
        type: 'click',
        date: Date.now(),
        userId: 1,
        content: {
          game_id: 1,
          is_recommended_game: 1,
        },
      };

      axios.post(postURL, userClickEvent)
        .then((resolve) => {
          assert(true);
          done();
        })
        .catch((error) => {
          // console.log('error posting event:', error);
          assert(false);
          done();
        });
    });
  });

  after(() => {
    server.stop();
  });
});
