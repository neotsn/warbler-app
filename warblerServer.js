const express = require('express');
const http = require('http');
const passport = require('passport');
const Twitter = require('twitter');
const session = require('express-session');
const cors = require('cors');
const socketio = require('socket.io');

// Prepare for Environmental Variables
require('dotenv').config();

const { Strategy: TwitterStrategy } = require('passport-twitter');
const { API_ENDPOINTS, SOCKET_EVENTS, URLS } = require('./client/src/constants');
const { TWITTER_AUTH_CONFIG, TWITTER_CLIENT_CONFIG } = require('./config');

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

// allows us to save the user into the session
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

// Basic setup with passport and Twitter
passport.use(new TwitterStrategy(
  TWITTER_AUTH_CONFIG,
  (accessToken, refreshToken, profile, cb) => {
    // console.log(profile);
    // save the user right here to a database if you want
    const user = {
      username: profile.username,
      displayName: profile.displayName,
      photo: profile.photos[0].value.replace(/_normal/, '')
    };
    cb(null, user);
  })
);

// Middleware that triggers the PassportJs authentication process
const twitterAuth = passport.authenticate('twitter');

/**
 * This call adds a custom middleware to pick off the socket id (that was put on req.query)
 * and stores it in the session so we can send back the right info to the right socket
 */
const addSocketId = (req, res, next) => {
  console.log(req.query.socketId);
  req.session.socketId = req.query.socketId;
  next();
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
  io.in(req.session.socketId)
    .emit(SOCKET_EVENTS.TWITTER_USER, Object.assign({}, req.user, {
      oauth_token: req.query.oauth_token,
      oauth_verifier: req.query.oauth_verifier,
      oauth_token_secret: JSON.parse(req.sessionStore.sessions[req.session.id])['oauth:twitter'].oauth_token_secret
    }));

  res.end();
});

// app.post(API_ENDPOINTS.TWITTER_GET_PROFILE, addSocketId, (req, res) => {
//   const socketConnection = io.in(req.session.socketId);
//
//   console.log(req.body);

  // const client = new Twitter(Object.assign({}, TWITTER_CLIENT_CONFIG, {
  //   access_token_key: req.oauth_token,
  //   access_token_secret: req.oauth_token_secret
  // }));
  //
  // client.get('/users/show', { screen_name: req.username }, (err, userObject, response) => {
  //   if (err) {
  //     console.log(err);
  //     socketConnection.emit(SOCKET_EVENTS.ERROR, err);
  //   } else {
  //     console.log(userObject);
  //     console.log(response);
  //     socketConnection
  //       .emit(SOCKET_EVENTS.TWITTER_GET_PROFILE, userObject);
  //   }
  // });
//   res.end();
// });

/**
 * Start the server
 */
server.listen(3100, () => {
  console.log('listening...');
});
