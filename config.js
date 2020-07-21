const { URLS } = require('./client/src/constants');

exports.TWITTER_AUTH_CONFIG = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackUrl: URLS.API_SERVER
};

exports.TWITTER_CLIENT_CONFIG = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: null,
  access_token_secret: null
};
