import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import { Done } from '@material-ui/icons';

export default class TwitterProfile extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
    this.state = {
      profile: '',
      characterCount: 0,
      maxCharacters: 160
    };
  }

  componentDidMount() {
    this.doProfileChange();
  }

  componentDidUpdate() {
    this.doProfileChange();
  }

  doProfileChange() {
    if (!this.state.profile && this.state.profile !== this.props.user.description) {
      this.setState({
        profile: this.props.user.description,
        characterCount: (this.props.user.description || '').length
      });
    }
  }

  /**
   * Update a Character Count as the user types
   */
  onInputChange = (e) => {
    this.setState({
      profile: e.target.value,
      characterCount: e.target.value.length
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onProfileUpdate({
      data: {
        description: this.state.profile
      }
    });
  };

  render() {
    const { profile, characterCount, maxCharacters } = this.state;

    return (
      <div>
        <TextField
          label={'Twitter Profile Description'}
          name={'twitter_user_description'}
          rows={5}
          rowsMax={10}
          margin={'normal'}
          value={profile || ''}
          variant={'outlined'}
          multiline
          fullWidth={true}
          helperText={`${characterCount}/${maxCharacters}`}
          onChange={this.onInputChange}
        />
        <Button
          variant={'contained'}
          color={'secondary'}
          startIcon={<Done/>}
          onClick={this.onSubmit}
        >{'Save'}</Button>
      </div>
    );
  }
}

