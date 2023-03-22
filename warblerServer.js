const TwitterHelper = require('./helpers/TwitterHelper');
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const socketio = require('socket.io');
const { Strategy } = require('@superfaceai/passport-twitter-oauth2');
const { URLS, API_ENDPOINTS, SOCKET_EVENTS } = require('./client/src/constants');
const { createServer } = require('http');
const { onError } = require('./helpers/ResponseHelper');
const Tweets = require('./helpers/Tweets');

// Prepare for Environmental Variables
require('dotenv').config();

// <1> Serialization and deserialization
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Use the Twitter OAuth2 strategy within Passport
passport.use(
  new Strategy(
    {
      clientID: process.env.TWITTER_OAUTH2_CLIENTID,
      clientSecret: process.env.TWITTER_OAUTH2_CLIENTSECRET,
      clientType: 'confidential',
      callbackURL: `${process.env.BASE_API_URL}/twitter/callback`,
      passReqToCallback: true
    },
    // <3> Verify callback
    (req, accessToken, refreshToken, profile, done) => {
      const { session } = req;
      const { socketId } = session || {};
      // const { state, code } = req.query;
      const { id: user_id, username: screen_name } = profile;

      return done(null, {
        tokens: {
          accessToken,
          refreshToken
          // state,
          // code
        },
        socketId,
        profile,
        userData: { user_id, screen_name }
      });
    }
  )
);

/**
 * Middleware
 * @param saveUninitialized When true, should allow us to attach the socket id to the session before we have authenticated with Twitter
 */
const sessionMiddleware = session({
  secret: 'WarblerServer',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: 'auto'
  }
});

const app = express();
const server = createServer(app);
const io = socketio(server, {
  cors: {
    origin: URLS.CLIENT,
    methods: ['GET', 'POST']
  }
});

// Allows the application to accept JSON and use passport
app.use(express.json());
// Passport and session middleware initialization
app.use(passport.initialize());

// Set up cors to allow us to accept requests from our client
app.use(cors({
  origin: URLS.CLIENT
}));

// Setup the session
io.engine.use(sessionMiddleware);
app.use(sessionMiddleware);
app.use(passport.session());

/**
 * Middleware
 * Triggers the PassportJs authentication process
 */
const twitterAuth = passport.authenticate('twitter', {
  scope: ['tweet.read', 'users.read', 'tweet.write', 'offline.access'],
  session: true
});

/** Setup the socket from the request data */
const initSocket = (req) => io.in(req.session.socketId);
/**
 * Middleware
 * This call adds a custom middleware to pick off the socket id (that was put on req.query)
 * and stores it in the session, so we can send back the right info to the right socket
 */
const addSocketId = (req, res, next) => {
  req.session.socketId = req.query.socketId;
  next();
};
/**
 * Middleware
 * Wrap the actual API request in a socket ID verification, so it is skipped if
 * the response cannot be returned to the app. Minimizes excess API calls
 */
const verifySocket = (req, res, cb) => {
  const { session } = req;
  const { passport } = session || {};
  const { user } = passport || {};
  const { socketId } = user || {};

  const hasAuthSocketId = typeof socketId !== 'undefined' && socketId !== 'undefined';

  if (hasAuthSocketId) {
    req.session.socketId = socketId;
  }

  if (typeof req.session.socketId !== 'undefined' && req.session.socketId !== 'undefined') {
    cb(req, res);
  } else {
    console.log('Error: Socket ID is missing.');
  }
  res.end();
};

/**
 * <5> Start authentication flow
 * This is endpoint triggered by the popup on the client which starts the whole authentication process
 */
app.get(API_ENDPOINTS.TWITTER_AUTH, addSocketId, twitterAuth);

/**
 * <7> Callback handler
 * This is the endpoint that Twitter sends the user information to.
 * The twitterAuth middleware attaches the user to req.user and then
 * the user info is sent to the client via the socket id that is in the
 * session.
 */
app.get(API_ENDPOINTS.TWITTER_AUTH_CALLBACK, twitterAuth, (req, res) => {
  verifySocket(req, res, async (req, res) => {
    const socket = initSocket(req);

    /** @note None of this works. There is no codeVerifier or sessionState */
    // // Extract state and code from query string
    // const { state, code } = req.query;
    // // Get the saved codeVerifier from session
    // const { codeVerifier, state: sessionState } = req.session;
    //
    // if (!codeVerifier || !state || !sessionState || !code) {
    //   onError(socket, 'You denied the app or your session expired!');
    // } else if (state !== sessionState) {
    //   onError(socket, 'Stored tokens didnt match!');
    // } else {
    socket.emit(SOCKET_EVENTS.TWITTER_AUTH, req.user);
    // }
  });
});

app.post(API_ENDPOINTS.TWITTER_STATUS_UPDATE, addSocketId, (req, res) => {
  verifySocket(req, res, async (req, res) => {
    const socket = initSocket(req);

    try {
      const { status } = req.query;
      /** @todo Handle reply/thread functionality */
      const replyToId = null;

      new TwitterHelper({ req })
        .postStatus({
          status,
          onError: (reason) => onError(socket, reason),
          replyToId
        })
        .then((response) => {
          // const response = { tweet, data: { id: '123456789', text: status } };
          const { tweet, data } = response;
          console.log(tweet);
        });
    } catch (e) {
      onError(socket, e);
    }
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
      const { user_id: userId } = req.query;
      new TwitterHelper({ req })
        .getUser({
          userId,
          onError: (error) => onError(socket, error)
        })
        .then((userObject) => {
          if (userObject) {
            socket.emit(SOCKET_EVENTS.TWITTER_USER_GET, userObject.data);
          } else {
            return 'No User Object returned.';
          }
        });
    } catch (e) {
      onError(socket, e);
    }
  });
});

server.listen(3100, () => {
  console.log(`Listening on ${process.env.BASE_API_URL}`);
});
