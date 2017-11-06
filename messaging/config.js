const MessageConfig = { // eslint-disable-line no-unused-vars
  analytics: process.env.STEAMLY_MESSAGE_ANALYTICS || '<MESSAGEBUS_URL_HERE>',
  content: process.env.STEAMLY_MESSAGE_CONTENT || '<MESSAGEBUS_URL_HERE>',
  eventAggregator: process.env.STEAMLY_MESSAGE_EVENTAGGREGATOR || '<MESSAGEBUS_URL_HERE>',
  test: process.env.STEAMLY_MESSAGE_TEST || '<TEST_URL_HERE>',
};

module.exports.MessageConfig = MessageConfig;
