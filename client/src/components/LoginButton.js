import React, { Component } from 'react';
import { Avatar, Button, IconButton, ListItemText, Menu, MenuItem } from '@material-ui/core';
import warblerAuth from '../helpers/WarblerAuth';
import { DB_TABLES, SOCKET_EVENTS } from '../constants';
import { Twitter } from '@material-ui/icons';

class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.state = {
      authenticated: null,
      errors: [],
      menuAnchorEl: null,
      user: {}
    };
  }

  /**
   * @returns {Promise<void>}
   */
  async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      await this.props.auth.getUser({ socketId: this.props.socket.id });
      this.setState({ authenticated });
    }
  }

  /**
   * Add some Socket Listeners
   */
  componentDidMount() {
    this.checkAuthentication();
    this.props.socket
      .on(SOCKET_EVENTS.ERROR, errors => {
        this.onErrors({ errors });
      })
      .on(SOCKET_EVENTS.TWITTER_AUTH, data => {
        this.onTwitterAuth({ data });
      })
      .on(SOCKET_EVENTS.TWITTER_GET_USER, user => {
        // This is a UserObject from twitter
        this.setState({ user });
      });
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  handleMenuClose = () => this.setState({ menuAnchorEl: null });
  handleMenuOpen = (e) => this.setState({ menuAnchorEl: e.currentTarget });

  login = () => this.props.auth.login();
  logout = () => {
    this.handleMenuClose();
    this.props.auth.logout();
  };

  /**
   * Handle the Error event
   */
  onErrors = ({ errors } = {}) => {
    const errorMessages = [];
    Object.values(errors).forEach((error) => {
      errorMessages.push(`Error: ${error.message} [${error.code}]`);
    });
    errorMessages.join('<br>');

    this.setState({ errors: errorMessages });
  };

  /**
   * Handle the Twitter Authentication event
   */
  onTwitterAuth = ({ data } = {}) => {
    const { tokens, user } = data;
    const { username } = user;

    // Close the popup
    this.props.popup.close();

    // DB-stored credentials
    this.props.db.set({
      property: DB_TABLES.TWITTER_TOKENS,
      // Inject the username to auto-login the user on revisit
      value: Object.assign(tokens, { username })
    });

    // Immediately go fetch the User Object...
    this.props.auth.getUser({ username });
  };

  render() {
    const { authenticated, menuAnchorEl, user } = this.state;
    const { screen_name, profile_image_url_https } = user;

    if (authenticated === null) {
      return null;
    } else if (!authenticated) {
      return (
        <Button
          variant={'contained'}
          color={'secondary'}
          startIcon={<Twitter/>}
          onClick={this.login}
        >{'Login'}</Button>
      );
    } else {

      const menuPosition = {
        vertical: 'top',
        horizontal: 'right'
      };

      return (
        <div>
          <IconButton
            ref={this.wrapper}
            color={'inherit'}
            onClick={this.handleMenuOpen}>
            <Avatar alt={screen_name} src={profile_image_url_https}/>
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            anchorOrigin={menuPosition}
            transformOrigin={menuPosition}
            open={!!menuAnchorEl}
            onClose={this.handleMenuClose}
          >
            <MenuItem onClick={this.logout}>
              <ListItemText primary={'Logout'} secondary={user && screen_name}/>
            </MenuItem>
          </Menu>
        </div>
      );
    }
  }
}

export default warblerAuth(LoginButton);
