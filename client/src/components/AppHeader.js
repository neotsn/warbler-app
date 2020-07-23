import React from 'react';
import { AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';
import LoginButton from './LoginButton';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  headerButtons: {
    textAlign: 'right',
    flex: 1
  }
});

const AppHeader = ({ classes }) => {
  return (
    <AppBar position={'fixed'} className={classes.appBar}>
      <Toolbar>
        <Typography variant={'h6'} color={'inherit'}>
          Warbler
        </Typography>
        <div className={classes.headerButtons}>
          <LoginButton/>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles)(AppHeader);
