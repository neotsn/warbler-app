import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

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
        <ul>
          <li>
            <Link to={'/'}>{'Warbler App'}</Link>
          </li>
          <li>
            <Link to={'/feed'}>{'Warbler Feed'}</Link>
          </li>
          <li>
            <Link to={'/settings'}>{'Settings'}</Link>
          </li>
        </ul>
        <Switch>
          <Route exact path={'/'}
            // component={Home}
          >{'Warbler App'}</Route>
          <Route path={'/feed'}
            // component={Feed}
          >{'Warbler App'}</Route>
          <Route path={'/settings'}
            // component={Settings}
          >{'Settings'}</Route>
        </Switch>
      </Router>
    );
  }
}
