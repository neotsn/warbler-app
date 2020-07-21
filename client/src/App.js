import React, { Component } from 'react';
import io from 'socket.io-client';
import FontAwesome from 'react-fontawesome';
import './App.css';
import { API_ENDPOINTS, SOCKET_EVENTS, URLS } from './constants';
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
      error: {},
      user: {},
      profile: {},
      disabled: ''
    };
  }

  componentDidMount() {
    this.socket
      .on(SOCKET_EVENTS.ERROR, error => {
        this.setState({ error });
      })
      .on(SOCKET_EVENTS.TWITTER_USER, user => {
        this.popup.close();
        this.setDb({
          property: 'twitter.user',
          value: user
        });
        this.setState({ user });
      })
    ;
    // .on(SOCKET_EVENTS.TWITTER_USER_PROFILE, user => {
    //   this.setDb({
    //     property: 'twitter.profile',
    //     value: user
    //   });
    // });
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
    this.setDb({ property: 'twitter.user' });
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

  // doProfile() {
  //   const twitterUser = this.getDb({ property: 'twitter.user' });
  //   if (twitterUser.username.length) {
  //     fetch(Request.makeUrl({
  //       host: URLS.API_SERVER,
  //       uri: API_ENDPOINTS.TWITTER_GET_PROFILE,
  //       requestParams: {
  //         username: twitterUser.username,
  //         socketId: this.socket.id,
  //         oauth_token_key: twitterUser.oauth_token,
  //         oauth_token_secret: twitterUser.oauth_token_secret
  //       }
  //     }), {
  //       method: 'POST',
  //       contentType: 'application/json',
  //       accept: 'application/json'
  //     })
  //       .then(response => response.json())
  //       .then(response => {
  //         console.log(response);
  //       })
  //       .catch(err => {
  //         console.log(err);
  //       });
  //   }
  // }

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
      return JSON.parse(this.db.getItem(`warbler.${property}`));
    }
    console.log('Error: No db property defined to store');
    return false;
  }

  render() {
    const { disabled } = this.state;
    const { message, code } = this.state.error;
    const { username, displayName, photo } = this.state.user;

    return (
      <div className={'container'}>
        <div className={'error'}>
          {message ? <span>Error: {message} [{code}]</span> : ''}
        </div>
        <Navigation/>
        {
          username
          ? <div className={'card'}>
            <img
              src={photo}
              alt={username}
              // onClick={this.doProfile.bind(this)}
            />
            <FontAwesome
              name={'times-circle'}
              className={'close'}
              onClick={this.doCloseCard.bind(this)}
            />
            <h4>{`${displayName} (@${username})`}</h4>
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
   * Set a value to the Database
   * @param property
   * @param value
   */
  setDb({ property, value = undefined } = {}) {
    if (property.length) {
      this.db.setItem(`warbler.${property}`, JSON.stringify(value));
      return true;
    }
    console.log('Error: No db property defined to store');
    return false;
  }
}
