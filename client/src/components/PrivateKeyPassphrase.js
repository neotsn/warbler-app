import React, { Component } from 'react';
import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const styles = theme => ({
  formControl: {
    display: 'flex',
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%'
  }
});

class PrivateKeyPassphrase extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
    this.state = {
      passphrase: '',
      showPassphrase: false
    };
  }

  onChange = (e) => {
    this.setState({ passphrase: e.currentTarget.value });
    this.props.onChangePassphrase({ passphrase: e.currentTarget.value });
  };

  onClickShowPassphrase = () => {
    this.setState({ showPassphrase: !this.state.showPassphrase });
  };

  onMouseDownPassphrase = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <FormControl className={this.classes.formControl} variant={'outlined'}>
        <InputLabel htmlFor={'private-key-passphrase'}>Private Key Passphrase</InputLabel>
        <OutlinedInput
          label={'Private Key Passphrase'}
          id={'private-key-passphrase'}
          type={this.state.showPassphrase ? 'text' : 'password'}
          value={this.state.passphrase}
          onChange={this.onChange}
          endAdornment={
            <InputAdornment position={'end'}>
              <IconButton
                aria-label={'toggle passphrase visibility'}
                onClick={this.onClickShowPassphrase}
                onMouseDown={this.onMouseDownPassphrase}
                edge={'end'}
              >
                {this.state.showPassphrase ? <Visibility/> : <VisibilityOff/>}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText variant={'outlined'}>
          {'Without a passphrase, anyone with your private key can impersonate you.'}
        </FormHelperText>
      </FormControl>
    );
  }
}

export default withStyles(styles)(PrivateKeyPassphrase);
