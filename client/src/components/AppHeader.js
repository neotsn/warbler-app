import React, { Component } from 'react';
import { AppBar, Toolbar } from '@mui/material';
import { withStyles } from '@mui/styles';

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
        <Toolbar disableGutters>
          <img
            style={{ width: '32px', height: '32px', margin: '1rem' }}
            alt={'Warbler Logo'}
            src={'/images/logo/white.png'}
          />
          <img
            alt={'Warbler Wordmark'}
            src={'/images/wordmark/white.png'}
          />
          <div className={headerButtons}>
            {this.props.children}
          </div>
        </Toolbar>
      </AppBar>
    );
  }
};

export default withStyles(styles)(AppHeader);
