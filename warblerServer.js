const express = require('express');
const http = require('http');
const passport = require('passport');
const Twitter = require('twitter-lite');
const session = require('express-session');
const cors = require('cors');
const socketio = require('socket.io');
const twitterText = require('twitter-text');
// Prepare for Environmental Variables
require('dotenv').config();

const { Strategy: TwitterStrategy } = require('passport-twitter');
const { API_ENDPOINTS, DB_FIELDS, DB_TABLES, SOCKET_EVENTS, URLS } = require('./client/src/constants');
const { TWITTER_PASSPORT_CONFIG, TWITTER_CLIENT_CONFIG } = require('./config');

// Create the server and allow express and sockets to run on the same port
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Allows the application to accept JSON and use passport
app.use(express.json());
app.use(passport.initialize());

// Set up cors to allow us to accept requests from our client
app.use(cors({
  origin: URLS.CLIENT
}));

// saveUninitialized: true allows us to attach the socket id
// to the session before we have authenticated with Twitter
app.use(session({
  secret: 'WarblerServer',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: 'auto'
  }
}));
app.use(passport.session());

// allows us to save the user into the session
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

// Basic setup with passport and Twitter
passport.use(new TwitterStrategy(TWITTER_PASSPORT_CONFIG, (access_token_key, access_token_secret, profile, done) => {
  // save the user right here to a database if you want
  done(null, {
    tokens: {
      access_token_key,
      access_token_secret
    },
    userData: {
      user_id: profile._json.id_str,
      screen_name: profile.username
    }
  });
}));

// Middleware that triggers the PassportJs authentication process
const twitterAuth = passport.authenticate('twitter');

/**
 * This call adds a custom middleware to pick off the socket id (that was put on req.query)
 * and stores it in the session so we can send back the right info to the right socket
 */
const addSocketId = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};

/**
 * Setup the socket from the request data
 */
const initSocket = (req) => {
  return io.in(req.session.socketId);
};

/**
 * Wrap the actual API request in a socket ID verification so it is skipped if
 * the response cannot be returned to the app. Minimizes excess API calls
 * @param {Object} req
 * @param {Object} res
 * @param {function} cb
 */
const verifySocket = (req, res, cb) => {
  if (typeof req.session.socketId !== 'undefined' && req.session.socketId !== 'undefined') {
    cb(req, res);
  } else {
    console.log('Error: Socket ID is missing.');
  }
  res.end();
};

/**
 * Setup the Twitter Client from the request data
 */
const initClient = (req) => {
  const { access_token_key, access_token_secret } = req.query;

  return new Twitter(Object.assign({}, TWITTER_CLIENT_CONFIG, {
    access_token_key,
    access_token_secret
  }));
};

/**
 * Handler for the error-exception response processing from twitter-lite
 */
const onError = (socket, e) => {
  // Twitter Client will throw an exception if there is an error.
  // Catch it to handle consistently.
  let error = {};

  if ('errors' in e) {
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

/**
 * This is endpoint triggered by the popup on the client which starts the whole authentication process
 */
app.get(API_ENDPOINTS.TWITTER_AUTH, addSocketId, twitterAuth);

/**
 * This is the endpoint that Twitter sends the user information to.
 * The twitterAuth middleware attaches the user to req.user and then
 * the user info is sent to the client via the socket id that is in the
 * session.
 */
app.get(API_ENDPOINTS.TWITTER_AUTH_CALLBACK, twitterAuth, (req, res) => {
  verifySocket(req, res, async (req, res) => {
    initSocket(req)
      .emit(SOCKET_EVENTS.TWITTER_AUTH, req.user);
  });
});

/**
 * Fetch the UserObject for the `username` or `userid` provided, and
 * emit it back through the SOCKET_EVENTS.TWITTER_USER_GET event
 */
app.get(API_ENDPOINTS.TWITTER_USER_GET, addSocketId, (req, res) => {
  verifySocket(req, res, async (req, res) => {
    const socket = initSocket(req);

    try {
      const { user_id } = req.query;

      const userObject = await initClient(req)
        .get('/users/show', {
          user_id,
          include_entities: true
        });

      if (userObject) {
        socket.emit(SOCKET_EVENTS.TWITTER_USER_GET, userObject);
      } else {
        return 'No User Object returned.';
      }
    } catch (e) {
      onError(socket, e);
    }
  });
});

/**
 * Sends updated fields to the user update API
 */
app.post(API_ENDPOINTS.TWITTER_USER_UPDATE, addSocketId, (req, res) => {
  verifySocket(req, res, async (req, res) => {
    const socket = initSocket(req);

    try {
      const { description } = req.query;

      const userObject = await initClient(req)
        .post('/account/update_profile', {
          description,
          include_entities: true,
          skip_status: 1
        });

      if (userObject) {
        socket.emit(SOCKET_EVENTS.TWITTER_USER_UPDATE, userObject);
        socket.emit(SOCKET_EVENTS.SUCCESS, 'Profile description successfully updated.');
      } else {
        return 'No User object returned';
      }
    } catch (e) {
      onError(socket, e);
    }
  });
});

app.post(API_ENDPOINTS.TWITTER_STATUS_UPDATE, addSocketId, (req, res) => {
  verifySocket(req, res, async (req, res) => {
    const socket = initSocket(req);

    try {
      const { status, options } = req.query;
      const client = initClient(req);

      if (options.indexOf('thread') > -1) {

        const { id_str } = tweetObject;
        // const tweetObject = await client
        //   .post('statuses/update', {
        //     status,
        //     auto_populate_reply_metadata: true,
        //     trim_user: true,
        //   });

      } else if (options.indexOf('sign') > -1) {
        // const tweetObject = await client
        //   .post('statuses/update', {
        //     status,
        //     auto_populate_reply_metadata: true,
        //     trim_user: true,
        //   });
      } else {
        // const tweetObject = await client
        //   .post('statuses/update', {
        //     status,
        //     auto_populate_reply_metadata: true,
        //     trim_user: true,
        //   });
      }

      const { id_str } = tweetObject;

      console.log(tweetObject);

    } catch (e) {
      onError(socket, e);
    }
  });
});

/**
 * Start the server
 */
server.listen(3100, () => {
  console.log('listening...');
});
