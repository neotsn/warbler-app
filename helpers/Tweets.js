module.exports = class Tweets {
  static POST_STATUS_UPDATE = 'statuses/update';

  /**
   * Process the request to post a thread
   * @todo Update this to be thread-specific and handle signing
   * @returns {Promise<any>}
   */
  static postStatus = ({ client, status, doThread = false, doSign = false, onError } = {}) => {
    // const { id_str } = tweetObject; // TODO Not sure if this is needed yet

    let content = null;

    /**
     * @TODO Not sure if this should be happening server side.
     * @TODO I think signing and threading should happen client-side.
     */

    if (doThread && doSign) {
      /** @todo Thread the tweet content and sign each post in the thread, and then sign the thread */
      content = status;
    } else if (doThread) {
      /** @TODO Only thread the tweet content */
      content = status;
    } else if (doSign) {
      /** @TODO Only sign the tweet content */
      content = status;
    } else {
      content = status;
    }

    /** @TODO Remove this when ready to start posting */
    return Promise.resolve({ id_str: 'It worked' });

    /** @TODO Restore this when ready to start posting */
    // return client
    //   .post(Tweets.POST_STATUS_UPDATE, {
    //     status: content,
    //     auto_populate_reply_metadata: true,
    //     trim_user: true
    //   })
    //   .catch((reason) => onError(reason));
  };
};
