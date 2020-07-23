import React, { Component } from 'react';
import io from 'socket.io-client';
import { API_ENDPOINTS, DB_FIELDS, DB_TABLES, URLS } from '../constants';
import { Request } from './request';

// This function takes a component...
export default function warblerAuth(WrappedComponent) {
  // ...and returns another component...
  return class extends Component {
    constructor(props) {
      super(props);

      /**
       * Setup the Socket.io connection - but it's not immediately connected
       * so the `await` keyword needs to be used on the first call to the socket
       */
      this.socket = io(URLS.API_SERVER);
      this.popup = null;
      this.state = {
        disabled: ''
      };

      this.initDb();
      this.initAuth();
    }

    /**
     * Routinely checks the popup to re-enable the login button
     * if the user cloes the popup without authenticating
     */
    doCheckPopup() {
      const { popup } = this;
      const check = setInterval(() => {
        if (!popup || popup.closed || popup.closed === undefined) {
          clearInterval(check);
          this.setState({ disabled: '' });
        }
      }, 1000);
    }

    /**
     * Launches the popup on the server and passes along the socket id
     * so it can be used to send back user data to the appropriate socket
     * on the connected client
     * @returns {Window}
     */
    doOpenPopup({ url } = {}) {
      const width = 600;
      const height = 600;
      const left = (window.innerWidth / 2) - (width / 2);
      const top = (window.innerHeight / 2) - (height / 2);

      return window.open(url, '',
        `toolbar=no, location=no, directories=no, status=no, menubar=no,
      scrollbars=no, resizable=no, copyhistory=no, width=${width},
      height=${height}, top=${top}, left=${left}`
      );
    }

    initAuth() {
      this.auth = {};

      /**
       * Compile the common credentials passed to the Twitter Client API endpoints
       */
      this.auth.buildTwitterClientCredentials = () => {
        const tokens = this.db.get({ property: DB_TABLES.TWITTER_TOKENS });

        return Object.assign({}, {
          socketId: this.state.socketId,
          oauth_token_key: tokens[DB_FIELDS.TWITTER_TOKENS.OAUTH_TOKEN] || null,
          oauth_token_secret: tokens[DB_FIELDS.TWITTER_TOKENS.OAUTH_TOKEN_SECRET] || null
        });
      };

      /**
       * Return true if there is a known secret in the token store
       */
      this.auth.isAuthenticated = () => {
        const tokens = this.db.get({ property: DB_TABLES.TWITTER_TOKENS });
        return (tokens && tokens.hasOwnProperty(DB_FIELDS.TWITTER_TOKENS.OAUTH_TOKEN_SECRET));
      };

      /**
       * Request the User Object from the Twitter Client API
       */
      this.auth.getUser = ({ socketId } = {}) => {
        // Cache the socketId
        this.setState({ socketId });
        // Pull the Tokens
        const tokens = this.db.get({ property: DB_TABLES.TWITTER_TOKENS });

        // Check that we've authenticated before
        if (tokens && tokens.hasOwnProperty('username')) {
          const { username } = tokens;

          if (username && username.length) {
            fetch(Request.makeUrl({
              host: URLS.API_SERVER,
              uri: API_ENDPOINTS.TWITTER_GET_USER,
              requestParams: Object.assign(this.auth.buildTwitterClientCredentials(), { username })
            }))
              .catch(err => { console.log(err); });
          }
        }
      };

      /**
       * Kicks off the processes of opening the popup on the server and listening
       * to the popup. It also disables the login button so the user can not
       * attempt to login to the provider twice.
       */
      this.auth.login = () => {
        if (!this.state.disabled) {
          this.popup = this.doOpenPopup({
            url: Request.makeUrl({
              host: URLS.API_SERVER,
              uri: API_ENDPOINTS.TWITTER_AUTH,
              requestParams: {
                socketId: this.socket.id
              }
            })
          });
          this.doCheckPopup();
          this.setState({ disabled: 'disabled' });
        }
      };

      /**
       * Clears out the user's info when the card is closed
       */
      this.auth.logout = () => {
        this.db.set({ property: DB_TABLES.TWITTER_TOKENS });
        this.setState({ user: {} });
      };
    }

    /**
     * Configure a db property with LocalStorage getter/setter overrides
     */
    initDb() {
      this.db = {
        /**
         * Get a value from the LocalStorage database
         * @param property
         * @returns {string|boolean}
         */
        get({ property } = {}) {
          if (property.length) {
            return JSON.parse(window.localStorage.getItem(property));
          }
          console.log('Error: No db property defined to store');
          return false;
        },

        /**
         * Set a value to the LocalStorage database
         * @param property
         * @param value
         */
        set({ property, value = '' } = {}) {
          if (property.length) {
            window.localStorage.setItem(property, JSON.stringify(value));
            return true;
          }
          console.log('Error: No db property defined to store');
          return false;
        }
      };
    }

    render() {
      // Send down the auth functions, the db connection, the popup window, and the socket object
      return (
        <WrappedComponent
          auth={this.auth}
          db={this.db}
          popup={this.popup}
          socket={this.socket}
          {...this.props}
        />
      );
    }
  };
};
