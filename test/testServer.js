/* global describe, it, xit, before, after */
/* eslint no-unused-vars: ["error", { "args": "none" }] */
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_id"] }] */

const assert = require('assert');
const axios = require('axios');
const server = require('../server/index.js');
const db = require('../db/index.js');

const STEAMLY_TEST_PORT = 3498;

const config = {
  baseURL: process.env.STEAMLY_TEST_SERVER_URL || 'localhost',
  port: process.env.STEAMLY_TEST_SERVER_PORT || STEAMLY_TEST_PORT,
};

describe('steam.ly - server', () => {
  before(() => {
    server.start();
  });

  describe('/user', () => {
    const GET_URL = `http://${config.baseURL}:${config.port}/user`;

    it('should return 404 when there is no user available', (done) => {
      const invalidUserId = '400';

      axios.get(`${GET_URL}/${invalidUserId}`)
        .then((response) => {
          assert(false);
          done();
        })
        .catch((error) => {
          assert(error.response.status === 404);
          done();
        });
    });

    xit('should return a user when it is available', (done) => {
      const validUserId = 1;

      axios.get(`${GET_URL}/${validUserId}`)
        .then((response) => {
          assert(response.body._id === validUserId);
          done();
        })
        .catch((error) => {
          assert(error.response.status === 404);
          done();
        });
    });

    // db.close();
  });

  describe('/event', () => {
    const postURL = `http://${config.baseURL}:${config.port}/event`;

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
        .then((response) => {
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
          assert(false);
          done();
        });
    });
  });

  after(() => {
    server.stop();
  });
});
