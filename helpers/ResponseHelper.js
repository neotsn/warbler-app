const { SOCKET_EVENTS } = require('../client/src/constants');
module.exports = class ResponseHelper {
  /**
   * Handler for the error-exception response processing from twitter-lite
   */
  static onError(socket, e) {
    // Twitter Client will throw an exception if there is an error.
    // Catch it to handle consistently.
    let error = {};

    if (e && e.errors && e.errors.length) {
      // Twitter API error
      if (e.errors[0].code === 88) {
        // rate limit exceeded
        error = {
          message: `Rate limit will reset on ${new Date(e._headers.get('x-rate-limit-reset') * 1000)}`,
          code: 88
        };
      } else {
        // some other kind of error, e.g. read-only API trying to POST
        error = {
          message: e.errors[0].message,
          code: e.errors[0].code
        };
      }
    } else {
      // non-API error, e.g. network problem or invalid JSON in response
      error = {
        message: 'There was a problem with the network or response.',
        code: 9641
      };
    }

    console.log(error, e);
    socket.emit(SOCKET_EVENTS.ERROR, error);
  };
};
