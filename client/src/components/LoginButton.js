import React, { Component } from 'react';
import { Avatar, Button, IconButton, ListItemText, Menu, MenuItem } from '@mui/material';
import { Twitter } from '@mui/icons-material';

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
    const { menuAnchorEl } = this.state;
    const { username, profile_image_url } = user;

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
console.log(user);
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
  }
}

export default LoginButton;
