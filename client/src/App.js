import React, { Component, Fragment } from 'react';
import AppHeader from './components/AppHeader';
import Database from './helpers/Database';
import Feed from './pages/Feed';
import Home from './pages/Home';
import LoginButton from './components/LoginButton';
import Navigation from './components/Navigation';
import Pgp from './helpers/Pgp';
import Request from './helpers/Request';
import Settings from './pages/Settings';
import TransitionAlert from './components/TransitionAlert';
import io from 'socket.io-client';
import { API_ENDPOINTS, DB_FIELDS, DB_TABLES, SOCKET_EVENTS, URLS } from './constants';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container, CssBaseline, Paper, ThemeProvider, Toolbar } from '@mui/material';
import { createTheme, useTheme } from '@mui/material/styles';
import { deepPurple, lightBlue } from '@mui/material/colors';
import { makeStyles, withStyles } from '@mui/styles';

// Setup the custom colors
const theme = createTheme({
  palette: {
    // mode: 'dark',
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
  },
  paper: {
    display: 'flex',
    margin: '0 auto',
    width: '50vw',
    border: `1px solid ${useTheme().palette.divider}`,
    flexWrap: 'wrap'
  }
}));

// Generate the App output
class App extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
    this.db = Database;
    this.pgp = Pgp;
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

    /** @note These need to be in this order, they use from previous init methods */
    this.initAuth();
    this.initPopup();
    this.initTwitter();
  }

  /**
   * Add some Socket Listeners
   */
  componentDidMount() {
    this.auth.checkAuthentication();

    this.socket
      .on(SOCKET_EVENTS.SUCCESS, (success) => this.setState({ success }))
      .on(SOCKET_EVENTS.ERROR, (error) => this.setState({ error }))
      .on(SOCKET_EVENTS.TWITTER_AUTH, (response) => this.twitter.onAuth({ response }))
      .on(SOCKET_EVENTS.TWITTER_USER_GET, (user) => this.twitter.onUser({ user }))
      // Update the user record in state with the changes sent to the server
      .on(SOCKET_EVENTS.TWITTER_USER_UPDATE, (user) => this.setState({ user }));
  }

  componentDidUpdate() {
    this.auth.checkAuthentication();
  }

  /** Setup some authentication methods and helpers */
  initAuth() {
    this.auth = {
      /** Compile the common credentials passed to the Twitter Client API endpoints */
      buildTwitterClientCredentials: () => {
        const tokens = this.db.getField({ field: DB_TABLES.TWITTER_TOKENS });

        return Object.assign({}, {
          socketId: this.socket.id,
          accessToken: tokens[DB_FIELDS.TWITTER_TOKENS.ACCESS_TOKEN] || null
        });
      },

      /**
       * Kicks off the processes of opening the popup on the server and listening
       * to the popup. It also disables the login button so the user can not
       * attempt to log in to the provider twice.
       */
      doLogin: () => {
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
      },

      /** Clears out the user's info when the card is closed */
      doLogout: () => {
        this.db.setField({ field: DB_TABLES.TWITTER_TOKENS });
        this.setState({ user: {} });
      },

      /** Request the User Object from the Twitter Client API */
      getUser: () => {
        // Pull the Tokens
        const tokens = this.db.getField({ field: DB_TABLES.TWITTER_TOKENS });

        // Check that we've authenticated before
        if (tokens && tokens.hasOwnProperty(DB_FIELDS.TWITTER_TOKENS.USERID)) {
          const { userId } = tokens;

          if (!!userId) {
            fetch(Request.makeUrl({
              host: URLS.API_SERVER,
              uri: API_ENDPOINTS.TWITTER_USER_GET,
              requestParams: Object.assign(this.auth.buildTwitterClientCredentials(), { userId })
            }))
              .catch(console.error);
          }
        }
      },

      /** Return true if there is a known secret in the token store */
      isAuthenticated: () => {
        const tokens = this.db.getField({ field: DB_TABLES.TWITTER_TOKENS });
        return (tokens && tokens.hasOwnProperty(DB_FIELDS.TWITTER_TOKENS.ACCESS_TOKEN));
      }
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
  }

  /** Setup some methods and property to manage popup windows */
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
      }, 500);
    };

    /**
     * Launches the popup on the server and passes along the socket id,
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

  initTwitter() {
    this.twitter = {
      /** Handle the Twitter Authentication event */
      onAuth: ({ response } = {}) => {
        const { tokens, userData } = response;
        const { userId, username } = userData;

        // Close the popup
        this.popup.window.close();

        // DB-stored credentials
        this.db.setField({
          field: DB_TABLES.TWITTER_TOKENS,
          // Inject the username to auto-login the user on revisit
          value: {
            ...tokens,
            userId,
            username
          }
        });

        // Immediately go fetch the User Object...
        this.auth.getUser();
      },
      /** Handle sending the Tweet/Status Update */
      onStatusUpdate: ({ data } = {}) => {
        const { status, options, passphrase } = data;

        const doThread = (options && options.indexOf('thread') > -1);
        const doSign = (options && options.indexOf('sign') > -1);

        let content = status;
        let signature = null;

        if (doThread && doSign) {
          /** @todo Thread the tweet content and sign each post in the thread, and then sign the thread */
          // content = status;
        } else if (doThread) {
          /** @TODO Only thread the tweet content */
          // content = status;
        } else if (doSign) {
          /** @TODO Only sign the tweet content */
          signature = this.pgp.createSignature({ passphrase, text: status });
          console.log('signature', signature);
          /** @todo Change Signature to be a verification URL at Warbler */
          content = `${content}\n🔑`;
        } else {
          // content = status;
        }

        fetch(Request.makeUrl({
          host: URLS.API_SERVER,
          uri: API_ENDPOINTS.TWITTER_STATUS_UPDATE,
          requestParams: {
            ...this.auth.buildTwitterClientCredentials(),
            status: content
          }
        }), {
          method: 'POST'
        })
          .catch(console.error);
      },
      /** Handle the Twitter User Object storage and mark as authenticated */
      onUser: ({ user } = {}) => {
        if (user) {
          // This is a UserObject from twitter
          this.setState({ user, isAuthenticated: true });
        }
      }
    };
  }

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
                <Container maxWidth={'md'}>
                  <Paper
                    sx={{ mt: 4 }}
                    elevation={1}
                    className={this.classes.paper}
                  >
                    <Routes>
                      <Route exact path={'/'}>
                        <Route index element={<Home/>}/>
                        <Route path="feed" element={
                          <Feed
                            user={this.state.user}
                            onStatusUpdate={this.twitter.onStatusUpdate.bind(this)}
                          />
                        }/>
                        <Route path="settings" element={
                          <Settings
                            user={this.state.user}
                          />
                        }/>
                      </Route>
                    </Routes>
                  </Paper>
                </Container>
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
