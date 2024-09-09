const { URLS } = require('./client/src/constants');

exports.TWITTER_PASSPORT_CONFIG = {
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackUrl: `${URLS.API_SERVER}${URLS.TWITTER_AUTH_CALLBACK}`
};

exports.TWITTER_CLIENT_CONFIG = {
  clientId: process.env.TWITTER_OAUTH2_CLIENTID,
  clientSecret: process.env.TWITTER_OAUTH2_CLIENTSECRET,
};
