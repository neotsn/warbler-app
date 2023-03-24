/**
 * Export the Warbler Server API Endpoint constants
 */
exports.API_ENDPOINTS = {
  TWITTER_AUTH: '/twitter',
  TWITTER_AUTH_CALLBACK: '/twitter/callback',
  TWITTER_USER_GET: '/twitter/user/get',
  TWITTER_STATUS_UPDATE: '/twitter/status/update'
};

/**
 * Export the field sets for each of the DB table names
 */
exports.DB_FIELDS = {
  TWITTER_TOKENS: {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USERNAME: 'username',
    USERID: 'userId',
    // CODE: 'code',
    // STATE: 'state',
    OAUTH_VERIFIER: 'oauth_verifier'
  }
};

/**
 * Export the LocalStorage Database Table names
 */
exports.DB_TABLES = {
  PGP_PUBLIC: 'warbler.pgp.public',
  PGP_PRIVATE: 'warbler.pgp.private',
  PGP_REVOKE: 'warbler.pgp.revoke',
  PGP_FINGER: 'warbler.pgp.finger',
  TWITTER_TOKENS: 'warbler.twitter.tokens'
};

/**
 * Export the Socket IO Event Constants for consistent usage
 */
exports.SOCKET_EVENTS = {
  ERROR: 'warbler.error',
  SUCCESS: 'warbler.success',
  TWITTER_AUTH: 'warbler.twitter.auth',
  TWITTER_USER_GET: 'warbler.twitter.get.user',
  TWITTER_USER_UPDATE: 'warbler.twitter.update.user',
  WARNING: 'warbler.warning'
};

/**
 * Application URLs
 */
exports.URLS = {
  API_SERVER: 'http://127.0.0.1:3100',
  CLIENT: 'http://127.0.0.1:3000',
  SHORTENER: 'https://v.gd/create.php'
};
