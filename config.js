const { URLS } = require('./client/src/constants');

exports.TWITTER_PASSPORT_CONFIG = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackUrl: `${URLS.API_SERVER}${URLS.TWITTER_AUTH_CALLBACK}`
};

exports.TWITTER_CLIENT_CONFIG = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  // Filled in with the passport token & secret
  access_token_key: null,
  access_token_secret: null
};
