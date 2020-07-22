/**
 * Export the Warbler Server API Endpoint constants
 */
exports.API_ENDPOINTS = {
  TWITTER_AUTH: '/twitter',
  TWITTER_AUTH_CALLBACK: '/twitter/callback',
  TWITTER_GET_USER: '/twitter/user/get'
};

/**
 * Export the field sets for each of the DB table names
 * @type {{TWITTER_TOKENS: {OAUTH_VERIFIER: string, OAUTH_TOKEN: string, OAUTH_TOKEN_SECRET: string}}}
 */
exports.DB_FIELDS = {
  TWITTER_TOKENS: {
    OAUTH_TOKEN: 'oauth_token',
    OAUTH_TOKEN_SECRET: 'oauth_token_secret',
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
  TWITTER_GET_USER: 'warbler.twitter.get.user'
};

/**
 * Application URLs
 */
exports.URLS = {
  API_SERVER: 'http://127.0.0.1:3100',
  CLIENT: 'http://127.0.0.1:3000'
};
