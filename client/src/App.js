import React, { Component, Fragment } from 'react';
import { CssBaseline, ThemeProvider, Toolbar } from '@mui/material';
import { createTheme, useTheme } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { deepPurple, lightBlue } from '@mui/material/colors';
import AppHeader from './components/AppHeader';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Settings from './pages/Settings';
import { API_ENDPOINTS, DB_FIELDS, DB_TABLES, SOCKET_EVENTS, URLS } from './constants';
import io from 'socket.io-client';
import { Request } from './helpers/request';
import LoginButton from './components/LoginButton';
import TransitionAlert from './components/TransitionAlert';

// Setup the custom colors
const theme = createTheme({
  palette: {
    primary: {
      main: deepPurple[700]
    },
    secondary: {
      main: lightBlue[600]
    }
  }
});

// Add some styles using the theme settings
const styles = makeStyles(() => ({
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    padding: useTheme().spacing(3),
    [useTheme().breakpoints.down('xs')]: {
      padding: useTheme().spacing(2)
    }
  }
}));

// Generate the App output
class App extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
    this.socket = io(URLS.API_SERVER, {
      // withCredentials: true,
      // extraHeaders: {
      //   "my-custom-header": "abcd"
      // }
    });
    this.state = {
      disabled: '',
      error: '',
      success: '',
      isAuthenticated: null,
      user: {}
    };

    this.initDb();
    this.initAuth();
    this.initPopup();
  }

  /**
   * Add some Socket Listeners
   */
  componentDidMount() {
    this.auth.checkAuthentication();

    this.socket
      .on(SOCKET_EVENTS.SUCCESS, success => {
        this.setState({ success });
      })
      .on(SOCKET_EVENTS.ERROR, error => {
        this.setState({ error });
      })
      .on(SOCKET_EVENTS.TWITTER_AUTH, response => {
        const { tokens, userData } = response;
        this.onTwitterAuth({ tokens, userData });
      })
      .on(SOCKET_EVENTS.TWITTER_USER_GET, user => {
        if (user) {
          // This is a UserObject from twitter
          this.setState({ user, isAuthenticated: true });
        }
      })
      .on(SOCKET_EVENTS.TWITTER_USER_UPDATE, user => {
        // Update the user record in state with the changes sent to the server
        this.setState({ user });
      });
  }

  componentDidUpdate() {
    this.auth.checkAuthentication();
  }

  /**
   * Setup some authentication methods and helpers
   */
  initAuth() {
    this.auth = {};

    /**
     * Compile the common credentials passed to the Twitter Client API endpoints
     */
    this.auth.buildTwitterClientCredentials = () => {
      const tokens = this.db.get({ property: DB_TABLES.TWITTER_TOKENS });

      return Object.assign({}, {
        socketId: this.socket.id,
        access_token_key: tokens[DB_FIELDS.TWITTER_TOKENS.ACCESS_TOKEN_KEY] || null,
        access_token_secret: tokens[DB_FIELDS.TWITTER_TOKENS.ACCESS_TOKEN_SECRET] || null
      });
    };

    /**
     * Run the user fetch asynchronously if the authentication result is not what is stored in State
     * @returns {Promise<void>}
     */
    this.auth.checkAuthentication = async () => {
      const check = setInterval(() => {
        if (typeof this.socket.id !== 'undefined') {
          clearInterval(check);
          const isAuthenticated = this.auth.isAuthenticated();
          if (isAuthenticated !== this.state.isAuthenticated) {
            this.auth.getUser();
            this.setState({ isAuthenticated });
          }
        }
      }, 100);
    };

    /**
     * Kicks off the processes of opening the popup on the server and listening
     * to the popup. It also disables the login button so the user can not
     * attempt to log in to the provider twice.
     */
    this.auth.doLogin = () => {
      this.setState({ disabled: 'disabled' });

      this.popup.doOpen({
        url: Request.makeUrl({
          host: URLS.API_SERVER,
          uri: API_ENDPOINTS.TWITTER_AUTH,
          requestParams: {
            socketId: this.socket.id
          }
        })
      });
      this.popup.doCheck();
    };

    /**
     * Clears out the user's info when the card is closed
     */
    this.auth.doLogout = () => {
      this.db.set({ property: DB_TABLES.TWITTER_TOKENS });
      this.setState({ user: {} });
    };

    /**
     * Return true if there is a known secret in the token store
     */
    this.auth.isAuthenticated = () => {
      const tokens = this.db.get({ property: DB_TABLES.TWITTER_TOKENS });
      return (tokens && tokens.hasOwnProperty(DB_FIELDS.TWITTER_TOKENS.ACCESS_TOKEN_SECRET));
    };

    /**
     * Request the User Object from the Twitter Client API
     */
    this.auth.getUser = () => {
      // Pull the Tokens
      const tokens = this.db.get({ property: DB_TABLES.TWITTER_TOKENS });

      // Check that we've authenticated before
      if (tokens && tokens.hasOwnProperty('user_id')) {
        const { user_id } = tokens;

        if (user_id && user_id.length) {
          fetch(Request.makeUrl({
            host: URLS.API_SERVER,
            uri: API_ENDPOINTS.TWITTER_USER_GET,
            requestParams: Object.assign(this.auth.buildTwitterClientCredentials(), { user_id })
          }))
            .catch(console.error);
        }
      }
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
          return JSON.parse(window.localStorage.getItem(property)) || '';
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

  /**
   * Setup some methods and property to manage popup windows
   */
  initPopup() {
    this.popup = { window: null };

    /**
     * Routinely checks the popup to re-enable the login button
     * if the user cloes the popup without authenticating
     */
    this.popup.doCheck = () => {
      const check = setInterval(() => {
        if (!this.popup.window || this.popup.window.closed || this.popup.window.closed === undefined) {
          clearInterval(check);
          this.setState({ disabled: '' });
        }
      }, 1000);
    };

    /**
     * Launches the popup on the server and passes along the socket id
     * so it can be used to send back user data to the appropriate socket
     * on the connected client
     * @returns {Window}
     */
    this.popup.doOpen = ({ url } = {}) => {
      const width = 600;
      const height = 600;
      const left = (window.innerWidth / 2) - (width / 2);
      const top = (window.innerHeight / 2) - (height / 2);

      this.popup.window = window.open(url, '',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no,
         resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );
    };
  }

  /**
   * Handle sending the new profile data to the API Server
   */
  onProfileUpdate = ({ data } = {}) => {
    const { description } = data;

    fetch(Request.makeUrl({
      host: URLS.API_SERVER,
      uri: API_ENDPOINTS.TWITTER_USER_UPDATE,
      requestParams: Object.assign({}, this.auth.buildTwitterClientCredentials(), { description })
    }), {
      method: 'POST'
    })
      .catch(console.error);
  };

  /**
   * Handle sending the Tweet/Status Update
   */
  onStatusUpdate = ({ data } = {}) => {
    const { status, options } = data;

    fetch(Request.makeUrl({
      host: URLS.API_SERVER,
      uri: API_ENDPOINTS.TWITTER_STATUS_UPDATE,
      requestParams: Object.assign({}, this.auth.buildTwitterClientCredentials(), { status, options })
    }), {
      method: 'POST'
    })
      .catch(console.error);
  };

  /**
   * Handle the Twitter Authentication event
   */
  onTwitterAuth = ({ tokens, userData } = {}) => {
    const { user_id, screen_name } = userData;

    // Close the popup
    this.popup.window.close();

    // DB-stored credentials
    this.db.set({
      property: DB_TABLES.TWITTER_TOKENS,
      // Inject the username to auto-login the user on revisit
      value: Object.assign({}, tokens, { user_id, screen_name })
    });

    // Immediately go fetch the User Object...
    this.auth.getUser();
  };

  render() {
    const { root, content } = this.classes;
    const { isAuthenticated, user, error, success } = this.state;

    return (
      <BrowserRouter>
        <Fragment>
          <ThemeProvider theme={theme}>
            <div className={root}>
              <CssBaseline/>
              <AppHeader>
                <LoginButton
                  isAuthenticated={isAuthenticated}
                  user={user}
                  doLogin={this.auth.doLogin.bind(this)}
                  doLogout={this.auth.doLogout.bind(this)}
                />
              </AppHeader>

              <main className={content}>
                <Toolbar/>
                {success ? <TransitionAlert severity={'success'} content={success}/> : null}
                {error ? <TransitionAlert severity={'error'} content={`${error.message} [${error.code}]`}/> : null}
                <Routes>
                  <Route exact path={'/'}>
                    <Route index element={<Home/>}/>
                    <Route path="feed" element={<Feed
                      user={this.state.user}
                      onStatusUpdate={this.onStatusUpdate.bind(this)}
                    />}/>
                    <Route path="settings" element={<Settings
                      user={this.state.user}
                      onProfileUpdate={this.onProfileUpdate.bind(this)}
                    />}/>
                  </Route>
                </Routes>
              </main>
              <Navigation
                isAuthenticated={!!isAuthenticated}
              />
            </div>
          </ThemeProvider>
        </Fragment>
      </BrowserRouter>
    );
  }
};

// Apply the custom styles to the app and return
export default withStyles(styles)(App);
