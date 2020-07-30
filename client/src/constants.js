/**
 * Export the Warbler Server API Endpoint constants
 */
exports.API_ENDPOINTS = {
  TWITTER_AUTH: '/twitter',
  TWITTER_AUTH_CALLBACK: '/twitter/callback',
  TWITTER_USER_GET: '/twitter/user/get',
  TWITTER_USER_UPDATE: '/twitter/user/update',
  TWITTER_STATUS_UPDATE: '/twitter/status/update'
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
  TWITTER_USER_GET: 'warbler.twitter.get.user',
  TWITTER_USER_UPDATE: 'warbler.twitter.update.user'
};

/**
 * Application URLs
 */
exports.URLS = {
  API_SERVER: 'http://127.0.0.1:3100',
  CLIENT: 'http://127.0.0.1:3000'
};
