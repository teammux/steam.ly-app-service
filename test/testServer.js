/* global describe, it, before, after */
const axios = require('axios');
const server = require('../server/index.js');

const STEAMLY_TEST_PORT = 3499;

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
    const postURL = `http://${config.baseURL}:{config.port}${config.eventEndpoint}`;

    it('endpoint should exist and handle a POST request', (done) => {
      axios.post(postURL)
        .then((resolve) => {
          console.log('resolve:', resolve);
          done();
        })
        .catch((error) => {
          console.log('error posting event:', error);
          done();
        });
    });
  });

  after(() => {
    server.stop();
  });
});
