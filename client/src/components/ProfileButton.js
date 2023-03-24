import React, { Component } from 'react';
import { Avatar, IconButton, ListItemText, Menu, MenuItem } from '@mui/material';

class LoginButton extends Component {
  constructor({ props } = {}) {
    super(props);

    this.wrapper = React.createRef();
    this.state = {
      menuAnchorEl: null
    };
  }

  handleLogout() {
    this.handleMenuClose();
    this.props.doLogout();
  }

  handleMenuClose() {
    this.setState({ menuAnchorEl: null });
  }

  handleMenuOpen(e) {
    this.setState({ menuAnchorEl: e.currentTarget });
  }

  render() {
    const { isAuthenticated, user } = this.props;

    if (!!isAuthenticated) {

      const { menuAnchorEl } = this.state;
      const { username, profile_image_url } = user;

      const menuPosition = {
        vertical: 'top',
        horizontal: 'right'
      };
      return (
        <div>
          <IconButton
            ref={this.wrapper}
            color={'inherit'}
            onClick={this.handleMenuOpen.bind(this)}>
            <Avatar alt={username} src={profile_image_url}/>
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            anchorOrigin={menuPosition}
            transformOrigin={menuPosition}
            open={!!menuAnchorEl}
            onClose={this.handleMenuClose.bind(this)}
          >
            <MenuItem onClick={this.handleLogout.bind(this)}>
              <ListItemText primary={'Logout'} secondary={user && username}/>
            </MenuItem>
          </Menu>
        </div>
      );
    }

    return null;
  }
}

export default LoginButton;
