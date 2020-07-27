import React, { Component, Fragment } from 'react';
import { createMuiTheme, CssBaseline, ThemeProvider, Toolbar, withStyles } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import { deepPurple, lightBlue } from '@material-ui/core/colors';
import AppHeader from './components/AppHeader';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Settings from './pages/Settings';

// Setup the custom colors
const theme = createMuiTheme({
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
const styles = theme => ({
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  }
});

// Generate the App output
class App extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
    this.state = {
      user: {},
      isAuthenticated: null,
      socket: null
    };
  }

  /**
   * Setup a callback to init the user for the app
   */
  initUser({
    user = undefined,
    isAuthenticated = undefined,
    socket = undefined
  } = {}) {
    if (typeof user !== 'undefined') {
      this.setState({ user });
    }

    if (typeof isAuthenticated !== 'undefined') {
      this.setState({ isAuthenticated });
    }

    if (typeof socket !== 'undefined') {
      this.setState({ socket });
    }
  }

  render() {
    const { root, content } = this.classes;

    return (
      <Fragment>
        <ThemeProvider theme={theme}>
          <div className={root}>
            <CssBaseline/>
            <AppHeader initUser={this.initUser.bind(this)}/>
            <Navigation isAuthenticated={this.state.isAuthenticated}/>
            <main className={content}>
              <Toolbar/>
              <Switch>
                <Route exact path={'/'} component={Home}/>
                <Route path={'/feed'} component={Feed}/>
                <Route path={'/settings'} component={Settings}/>
              </Switch>
            </main>
          </div>
        </ThemeProvider>
      </Fragment>
    );
  }
};

// Apply the custom styles to the app and return
export default withStyles(styles)(App);
