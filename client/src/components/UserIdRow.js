import React, { Component } from 'react';
import { IconButton, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Delete } from '@mui/icons-material';

const styles = (theme) => ({
  controls: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    alignItems: 'flex-start',
    padding: theme.spacing(0, 1, 1)
  }
});

/**
 * Container for the input fields of a given UserID, with button to remove it
 */
class UserIdRow extends Component {
  constructor({ classes, props } = {}) {
    super(props);
    this.classes = classes;
  }

  onChangeEmail(e) {
    const { index, name } = this.props;
    this.props.onChangeUserId({
      index,
      name,
      email: e.currentTarget.value
    });
  };

  onChangeName(e) {
    const { index, email } = this.props;
    this.props.onChangeUserId({
      index,
      name: e.currentTarget.value,
      email
    });
  };

  onDelete(e) {
    e.preventDefault();
    const { index } = this.props;
    this.props.onDeleteUserId({ index });
  };

  render() {
    return (
      <div className={this.classes.controls}>
        <TextField
          id={`name-${this.props.index}`}
          label="Name"
          variant="outlined"
          value={this.props.name}
          helperText={'The name of a person associated to the Public Key'}
          onChange={this.onChangeName.bind(this)}
          required={true}
        />
        <TextField
          id={`email-${this.props.index}`}
          label="Email Address"
          variant="outlined"
          value={this.props.email}
          helperText={'Email address associated to the Public Key'}
          onChange={this.onChangeEmail.bind(this)}
          required={true}
        />
        {this.props.showDelete
         ? <IconButton color={'default'} aria-label={'delete'} onClick={this.onDelete.bind(this)}><Delete/></IconButton>
         : null}
      </div>
    );
  }
}

export default withStyles(styles)(UserIdRow);
