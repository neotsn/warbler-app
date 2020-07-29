import React, { Component } from 'react';
import { Divider, Typography } from '@material-ui/core';
import TwitterProfile from '../components/TwitterProfile';

/**
 * The settings page to handle Key upload/generation and adjusting the Twitter Profile Description
 */
export default class Settings extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
  }

  render() {
    return (
      <div>
        <Typography variant={'h4'}>Settings</Typography>
        <Divider/>
        <br/>
        <Typography variant={'h6'}>Twitter Settings</Typography>
        <TwitterProfile
          user={this.props.user}
          onProfileUpdate={this.props.onProfileUpdate}
        />
      </div>
    );
  }
}
