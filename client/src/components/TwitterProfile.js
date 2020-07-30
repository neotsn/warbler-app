import React, { Component } from 'react';
import { Button, Divider, Paper, TextField, withStyles } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import twitterText from 'twitter-text';

const styles = (theme) => ({
  paper: {
    display: 'flex',
    margin: '0 auto',
    width: '50vw',
    border: `1px solid ${theme.palette.divider}`,
    flexWrap: 'wrap'
  },
  input: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  controls: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
    padding: theme.spacing(0, 1, 1)
  }
});

class TwitterProfile extends Component {
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
        characterCount: twitterText.parseTweet(this.props.user.description).weightedLength
      });
    }
  }

  /**
   * Update a Character Count as the user types
   */
  onInputChange = (e) => {
    this.setState({
      profile: e.target.value,
      characterCount: twitterText.parseTweet(e.target.value).weightedLength
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
      <Paper
        elevation={1}
        className={this.classes.paper}
      >
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
          className={this.classes.input}
        />
        <Divider/>
        <div className={this.classes.controls}>
          <Button
            variant={'contained'}
            color={'secondary'}
            startIcon={<Done/>}
            onClick={this.onSubmit}
          >{'Save'}</Button>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(TwitterProfile);
