module.exports = class Tweets {
  static POST_STATUS_UPDATE = 'statuses/update';

  /**
   * Process the request to post a thread
   * @todo Update this to be thread-specific and handle signing
   * @returns {Promise<any>}
   */
  static postStatus = ({ client, status, onError } = {}) => {
    // const { id_str } = tweetObject; // TODO Not sure if this is needed yet

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
