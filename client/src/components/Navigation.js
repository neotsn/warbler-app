import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import Profile from './Profile';

export default class Navigation extends Component {
  constructor(props, context) {
    super(props, context);
    this.db = window.localStorage;
    this.state = props.state;
    this.socket = props.socket;
  }

  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to={'/'}>{'Warbler Home'}</Link>
            </li>
            <li>
              <Link to={'/profile'}>{'Edit Profile'}</Link>
            </li>
          </ul>
          <Switch>
            <Route path={'/profile'} component={Profile}/>
          </Switch>
        </div>
      </Router>
    );
  }
}
