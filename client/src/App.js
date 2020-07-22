import React, { Component } from 'react';
import io from 'socket.io-client';
import FontAwesome from 'react-fontawesome';
import './App.css';
import { API_ENDPOINTS, DB_FIELDS, DB_TABLES, SOCKET_EVENTS, URLS } from './constants';
import Navigation from './components/Navigation';
import { Request } from './helpers/request';

export default class App extends Component {
  constructor() {
    super();
    // Database is LocalStorage
    this.db = window.localStorage;
    this.socket = io(URLS.API_SERVER);
    this.popup = null;
    this.state = {
      errors: [],
      user: {},
      profile: {},
      disabled: ''
    };
    this.constructExistingUser();
  }

  /**
   * Compile the common credentials passed to the Twitter Client API endpoints
   */
  buildTwitterClientCredentials() {
    const tokens = this.getDb({ property: DB_TABLES.TWITTER_TOKENS });

    return Object.assign({}, {
      socketId: this.socket.id,
      oauth_token_key: tokens[DB_FIELDS.TWITTER_TOKENS.OAUTH_TOKEN] || null,
      oauth_token_secret: tokens[DB_FIELDS.TWITTER_TOKENS.OAUTH_TOKEN_SECRET] || null
    });
  }

  /**
   * Setup Socket Event Listeners
   */
  componentDidMount() {
    this.socket
      .on(SOCKET_EVENTS.ERROR, errors => {
        this.onErrors({ errors });
      })
      .on(SOCKET_EVENTS.TWITTER_AUTH, data => {
        this.onTwitterAuth({ data });
      })
      .on(SOCKET_EVENTS.TWITTER_GET_USER, user => {
        // This is a UserObject from twitter
        this.setState({ user });
      });
  }

  /**
   * Re-fetch the user's data if the credntials and username are still present
   */
  constructExistingUser() {
    const tokens = this.getDb({ property: DB_TABLES.TWITTER_TOKENS });

    if (tokens && tokens.hasOwnProperty('username')) {
      const { username } = tokens;

      if (username && username.length) {
        this.requestUserObject({ username });
      }
    }
  }

  /**
   * Routinely checks the popup to re-enable the login button
   * if the user cloes the popup without authenticating
   */
  doCheckPopup() {
    const { popup } = this.popup;
    const check = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        this.setState({ disabled: '' });
      }
    }, 1000);
  }

  /**
   * Clears out the user's info when the card is closed
   */
  doCloseCard() {
    this.setDb({ property: DB_TABLES.TWITTER_TOKENS });
    this.setState({ user: {} });
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

  /**
   * Kicks off the processes of opening the popup on the server and listening
   * to the popup. It also disables the login button so the user can not
   * attempt to login to the provider twice.
   */
  doStartAuth() {
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
  }

  /**
   * Get a value from the Database
   * @param property
   * @returns {string|boolean}
   */
  getDb({ property } = {}) {
    if (property.length) {
      return JSON.parse(this.db.getItem(property));
    }
    console.log('Error: No db property defined to store');
    return false;
  }

  /**
   * Handle the Error event
   */
  onErrors({ errors } = {}) {
    const errorMessages = [];
    Object.values(errors).forEach((error) => {
      errorMessages.push(`Error: ${error.message} [${error.code}]`);
    });
    errorMessages.join('<br>');

    this.setState({ errors: errorMessages });
  }

  /**
   * Handle the Twitter Authentication event
   */
  onTwitterAuth({ data } = {}) {
    const { tokens, user } = data;
    const { username } = user;

    // Close the popup
    this.popup.close();

    // DB-stored credentials
    this.setDb({
      property: DB_TABLES.TWITTER_TOKENS,
      // Inject the username to auto-login the user on revisit
      value: Object.assign(tokens, { username })
    });

    // Immediately go fetch the User Object...
    this.requestUserObject({ username });
  }

  render() {
    const { disabled, errors } = this.state;
    const { screen_name, name, profile_image_url_https } = this.state.user;

    return (
      <div className={'container'}>
        <div className={'error'}>
          {errors}
        </div>
        <Navigation/>
        {
          screen_name
          ? <div className={'card'}>
            <img src={profile_image_url_https.replace(/_normal/, '')} alt={screen_name}/>
            <FontAwesome
              name={'times-circle'}
              className={'close'}
              onClick={this.doCloseCard.bind(this)}
            />
            <h4>{`${name} (@${screen_name})`}</h4>
          </div>
          : <div className={'button'}>
            <button
              onClick={this.doStartAuth.bind(this)}
              className={`twitter ${disabled}`}
            >
              <FontAwesome name={'twitter'}/>
            </button>
          </div>
        }
      </div>
    );
  }

  /**
   * Request the User Object from the Twitter Client API
   * @param username The Username of the user (Required if no ID)
   * @param userid The User ID of the user (Required if no Username)
   */
  requestUserObject({ username = '', userid = '' } = {}) {
    if (username.length) {
      fetch(Request.makeUrl({
        host: URLS.API_SERVER,
        uri: API_ENDPOINTS.TWITTER_GET_USER,
        requestParams: Object.assign(this.buildTwitterClientCredentials(), { username, userid })
      }))
        .catch(err => {
          console.log(err);
        });
    }
  }

  /**
   * Set a value to the Database
   * @param property
   * @param value
   */
  setDb({ property, value = '' } = {}) {
    if (property.length) {
      this.db.setItem(property, JSON.stringify(value));
      return true;
    }
    console.log('Error: No db property defined to store');
    return false;
  }
}
