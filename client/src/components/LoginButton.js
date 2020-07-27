import React, { Component } from 'react';
import { Avatar, Button, IconButton, ListItemText, Menu, MenuItem } from '@material-ui/core';
import { Twitter } from '@material-ui/icons';

class LoginButton extends Component {
  constructor({ props } = {}) {
    super(props);

    this.wrapper = React.createRef();
    this.state = {
      menuAnchorEl: null
    };
  }

  handleMenuClose = () => this.setState({ menuAnchorEl: null });
  handleMenuOpen = (e) => this.setState({ menuAnchorEl: e.currentTarget });

  logout = () => {
    this.handleMenuClose();
    this.props.doLogout();
  };

  render() {
    const { isAuthenticated, user } = this.props;
    const { menuAnchorEl } = this.state;
    const { screen_name, profile_image_url_https } = user;

    if (isAuthenticated === null) {
      return null;
    } else if (!isAuthenticated) {
      return (
        <Button
          variant={'contained'}
          color={'secondary'}
          startIcon={<Twitter/>}
          onClick={this.props.doLogin}
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

export default LoginButton;
