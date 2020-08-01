import React, { Component } from 'react';
import { Divider, Typography } from '@material-ui/core';

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
        {this.props.children}
      </div>
    );
  }
}
