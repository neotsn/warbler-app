import React, { Fragment } from 'react';
import { createMuiTheme, CssBaseline, ThemeProvider, withStyles } from '@material-ui/core';
import { Route } from 'react-router-dom';
import { deepPurple, lightBlue } from '@material-ui/core/colors';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';

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
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2)
    }
  }
});

// Generate the App output
const App = ({ classes }) => {
  return (
    <Fragment>
      <CssBaseline/>
      <ThemeProvider theme={theme}>
        <AppHeader/>
        <main className={classes.main}>
          <Route exact path={'/'} component={Home}/>
        </main>
      </ThemeProvider>
    </Fragment>
  );
};

// Apply the custom styles to the app and return
export default withStyles(styles)(App);
