import React from 'react';
import { AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';
import LoginButton from './LoginButton';

const styles = {
  headerButtons: {
    textAlign: 'right',
    flex: 1
  }
};

const AppHeader = ({ classes }) => {
  return (
    <AppBar position={'static'}>
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
