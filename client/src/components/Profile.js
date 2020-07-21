import React, { Component } from 'react';

export default class Profile extends Component {
  constructor(props, context) {
    super(props, context);
    this.db = window.localStorage;
    this.state = props.state;
    this.socket = props.socket;
  }

  render() {
    return (
      <div>
        <h1>This is the twitter profile page.</h1>
      </div>
    );
  }
}
