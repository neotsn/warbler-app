/**
 * Export the Warbler Server API Endpoint constants
 */
exports.API_ENDPOINTS = {
  TWITTER_AUTH: '/twitter',
  TWITTER_AUTH_CALLBACK: '/twitter/callback',
  TWITTER_REQUEST_CALLBACK: '/twitter/request-callback',
  TWITTER_GET_USER: '/twitter/user/get',
  TWITTER_UPDATE_USER: '/twitter/user/update'
};

/**
 * Export the field sets for each of the DB table names
 */
exports.DB_FIELDS = {
  TWITTER_TOKENS: {
    ACCESS_TOKEN_KEY: 'access_token_key',
    ACCESS_TOKEN_SECRET: 'access_token_secret',
    OAUTH_VERIFIER: 'oauth_verifier'
  }
};

/**
 * Export the LocalStorage Database Table names
 */
exports.DB_TABLES = {
  TWITTER_TOKENS: 'warbler.twitter.tokens'
};

/**
 * Export the Socket IO Event Constants for consistent usage
 */
exports.SOCKET_EVENTS = {
  ERROR: 'warbler.error',
  TWITTER_AUTH: 'warbler.twitter.auth',
  TWITTER_GET_USER: 'warbler.twitter.get.user',
  TWITTER_UPDATE_USER: 'warbler.twitter.update.user'
};

/**
 * Application URLs
 */
exports.URLS = {
  API_SERVER: 'http://127.0.0.1:3100',
  CLIENT: 'http://127.0.0.1:3000'
};
