import React, { Component } from 'react';
import TwitterStatus from '../components/TwitterStatus';
import { Divider } from '@mui/material';

export default class Feed extends Component {
  constructor({ classes, props }) {
    super(props);

    this.classes = classes;
  }

  render() {
    return (
      <div>
        <TwitterStatus
          onStatusUpdate={this.props.onStatusUpdate}
        />
        <br/>
        <Divider/>
        <br/>
        {/* TODO Add the Twitter Feed Here */}
      </div>
    );
  }
}

