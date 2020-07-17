const clientUrl = 'http://127.0.0.1:3000';
const callbackUrl = 'http://127.0.0.1:3100';

exports.URLS = {
  clientUrl,
  callbackUrl,
}

exports.TWITTER_CONFIG = {
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackUrl
};
