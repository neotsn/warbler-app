import React, { Component } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';

// Setup some styles using the theme settings
const styles = makeStyles(() => ({
  appBar: {
    zIndex: useTheme().zIndex.drawer + 1
  },
  headerButtons: {
    textAlign: 'right',
    flex: 1
  }
}));

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
            {this.props.children}
          </div>
        </Toolbar>
      </AppBar>
    );
  }
};

export default withStyles(styles)(AppHeader);
