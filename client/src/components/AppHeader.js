import React, { Component } from 'react';
import { AppBar, Toolbar, Typography, withStyles } from '@material-ui/core';
import LoginButton from './LoginButton';

// Setup some styles using the theme settings
const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  headerButtons: {
    textAlign: 'right',
    flex: 1
  }
});

// Generate the AppHeader output
class AppHeader extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
  }

  render() {
    const { appBar, headerButtons } = this.classes;

    return (
      <AppBar position={'fixed'} className={appBar}>
        <Toolbar>
          <Typography variant={'h6'} color={'inherit'}>
            Warbler
          </Typography>
          <div className={headerButtons}>
            <LoginButton initUser={this.props.initUser}/>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
};

export default withStyles(styles)(AppHeader);
