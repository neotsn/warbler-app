import React, { Component } from 'react';
import { Button } from '@mui/material';
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
    const { isAuthenticated } = this.props;

    if (!isAuthenticated) {
      return (
        <Button
          variant={'contained'}
          color={'secondary'}
          startIcon={<Twitter/>}
          onClick={this.props.doLogin}
        >{'Login'}</Button>
      );
    }

    return null;
  }
}

export default LoginButton;
