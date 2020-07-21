/**
 * Application URLs
 */
exports.URLS = {
  API_SERVER: 'http://127.0.0.1:3100',
  CLIENT: 'http://127.0.0.1:3000'
};

/**
 * Export the Warbler Server API Endpoint constants
 */
exports.API_ENDPOINTS = {
  TWITTER_AUTH: '/twitter',
  TWITTER_AUTH_CALLBACK: '/twitter/callback',
  TWITTER_GET_PROFILE: '/twitter/profile/get'
};

/**
 * Export the Socket IO Event Constants for consistent usage
 */
exports.SOCKET_EVENTS = {
  ERROR: 'warbler.error',
  TWITTER_USER: 'warbler.twitter.user',
  TWITTER_GET_PROFILE: 'warbler.twitter.get.profile'
};
