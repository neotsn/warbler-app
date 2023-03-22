const { TWITTER_CLIENT_CONFIG } = require('../config');
const { TwitterApi } = require('twitter-api-v2');

/** Handles the Twitter API interactions  */
module.exports = class TwitterHelper {
  constructor({ req } = {}) {
    /** @todo check what is needed for this */
    const { accessToken, refreshToken } = req.query;

    this.api = new TwitterApi(accessToken);
  }

  /**
   * Process the request to fetch a user
   * @returns {Promise<any>}
   */
  getUser({ userId, onError } = {}) {
    return this.api.v2
      .user(userId, {
        'user.fields': [
          'entities',
          'profile_image_url'
        ]
      })
      .catch((reason) => onError(reason));
  }

  /**
   * Process the request to post a thread
   * @returns {Promise<any>}
   */
  postStatus({ status, onError, replyToId = null } = {}) {
    // /** @see https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets */
    // const tweetObject = {
    //   direct_message_deep_link: '',
    //   for_super_followers_only: false,
    //   geo: {
    //     place_id: ''
    //   },
    //   media: {
    //     media_ids: [],
    //     tagged_user_ids: []
    //   },
    //   poll: {
    //     duration_minutes: 10,
    //     options: ['yes', 'maybe', 'no']
    //   },
    //   quote_tweet_id: '',
    //   reply: {
    //     // exclude_reply_user_ids: [],
    //     in_reply_to_tweet_id: ''
    //   },
    //   reply_settings: '',
    //   text: ''
    // };

    const payload = {
      text: status
    };

    if (!!replyToId) {
      payload.reply = {
        // exclude_reply_user_ids: [],
        in_reply_to_tweet_id: replyToId
      };
    }

    // /** @TODO Remove this when ready to start posting */
    // return Promise.resolve({ tweet, data: { id: 'itworked', text: status } });

    return this.api.v2
      .tweet(payload)
      .catch((reason) => onError(reason));
  };
};
