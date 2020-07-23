import React, { Fragment } from 'react';
import { createMuiTheme, CssBaseline, Divider, List, ThemeProvider, Toolbar, withStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { Route } from 'react-router-dom';
import { deepPurple, lightBlue } from '@material-ui/core/colors';
import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import ViewStream from '@material-ui/icons/ViewStream';
import Settings from '@material-ui/icons/Settings';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 240;

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
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerContainer: {
    overflow: 'auto'
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
const App = ({ classes }) => {
  return (
    <Fragment>
      <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <AppHeader/>
          <Drawer
            className={classes.drawer}
            variant={'permanent'}
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <Toolbar/>
            <div className={classes.drawerContainer}>
              <List>
                <ListItem button key={'Feed'}>
                  <ListItemIcon><ViewStream/></ListItemIcon>
                  <ListItemText primary={'Feed'}/>
                </ListItem>
                <ListItem button key={'Settings'}>
                  <ListItemIcon><Settings/></ListItemIcon>
                  <ListItemText primary={'Settings'}/>
                </ListItem>
              </List>
              <Divider/>
              <List>
                <ListItem button key={'Logout'}>
                  <ListItemIcon></ListItemIcon>
                  <ListItemText primary={'Logout'}/>
                </ListItem>
              </List>
            </div>
          </Drawer>
          <main className={classes.content}>
            <Toolbar/>
            <Route exact path={'/'} component={Home}/>
          </main>
        </ThemeProvider>
      </div>
    </Fragment>
  );
};

// Apply the custom styles to the app and return
export default withStyles(styles)(App);
