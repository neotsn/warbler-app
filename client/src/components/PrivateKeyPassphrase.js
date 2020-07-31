import React, { Component } from 'react';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, withStyles } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const styles = theme => ({
  formControl: {
    display: 'flex',
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%'
  }
});

class PrivateKeyPassphrase extends Component {
  constructor({ classes, props }) {
    super(props);

    this.classes = classes;
    this.state = {
      password: '',
      showPassword: false
    };
  }

  onChange = (e) => {
    this.setState({ password: e.currentTarget.value });
  };

  onClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  onMouseDownPassword = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <FormControl className={this.classes.formControl} variant={'outlined'}>
        <InputLabel htmlFor={'private-key-passphrase'}>Private Key Passphrase</InputLabel>
        <OutlinedInput
          id={'private-key-passphrase'}
          type={this.state.showPassword ? 'text' : 'password'}
          value={this.state.password}
          onChange={this.onChange}
          endAdornment={
            <InputAdornment position={'end'}>
              <IconButton
                aria-label={'toggle password visibility'}
                onClick={this.onClickShowPassword}
                onMouseDown={this.onMouseDownPassword}
                edge={'end'}
              >
                {this.state.showPassword ? <Visibility/> : <VisibilityOff/>}
              </IconButton>
            </InputAdornment>
          }
          labelWidth={175}
        />
        <FormHelperText variant={'outlined'}>
          {'Without a passphrase, anyone with your private key can impersonate you.'}
        </FormHelperText>
      </FormControl>
    );
  }
}

export default withStyles(styles)(PrivateKeyPassphrase);
