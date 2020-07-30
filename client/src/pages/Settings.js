import React, { Component } from 'react';
import { Divider, Paper, Typography, withStyles } from '@material-ui/core';
import TwitterProfile from '../components/TwitterProfile';

const styles = theme => ({
  paper: {
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`
  }
});

/**
 * The settings page to handle Key upload/generation and adjusting the Twitter Profile Description
 */
class Settings extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
  }

  render() {
    return (
      <div>
        <Paper elevation={0} className={this.classes.paper}>
          <Typography variant={'h4'}>Settings</Typography>
          <Divider/>
          <br/>
          <Typography variant={'h6'}>Twitter Settings</Typography>
          <TwitterProfile
            user={this.props.user}
            onProfileUpdate={this.props.onProfileUpdate}
          />
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Settings);
