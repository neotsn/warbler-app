import React, { Component } from 'react';
import { Button, Container, Divider, TextField, ToggleButton } from '@mui/material';
import { withStyles } from '@mui/styles';
import { ViewStream, VpnKey } from '@mui/icons-material';
import twitterText from 'twitter-text';
import StyledToggleButtonGroup from './StyledToggleButtonGroup';
import PrivateKeyPassphrase from './PrivateKeyPassphrase';

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2)
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    padding: theme.spacing(2)
  }
});

class TwitterStatus extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
    this.state = {
      options: [],
      content: '',
      passphrase: null,
      characterCount: 0,
      maxCharacters: 280
    };
  }

  componentDidMount() {
    this.setState({ options: ['sign'] });
  }

  onChangePassphrase({ passphrase }) {
    this.setState({ passphrase });
  };

  /**
   * Update a Character Count as the user types
   */
  onInputChange = (e) => {
    this.setState({
      content: e.target.value,
      characterCount: twitterText.parseTweet(e.target.value).weightedLength
    });
  };

  onOptionChange = (e) => {
    e.preventDefault();
    const { value } = e.currentTarget;
    const { options } = this.state;

    const index = options.indexOf(value);

    if (index > -1) {
      // It's there, so drop it, and put the rest back into state
      delete options[index];
    } else {
      // It's not there, so add it, and update the state
      options.push(value);
    }
    this.setState({ options });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onStatusUpdate({
      data: {
        status: this.state.content,
        options: this.state.options,
        passphrase: this.state.passphrase
      }
    });
  };

  render() {
    const { content, characterCount, maxCharacters } = this.state;

    return (
      <Container className={this.classes.container}>
        <TextField
          label={'Tweet Content'}
          name={'twitter_tweet'}
          rows={5}
          // rowsMax={10}
          margin={'normal'}
          value={content || ''}
          variant={'outlined'}
          multiline
          fullWidth={true}
          helperText={`${characterCount}/${maxCharacters}`}
          onChange={this.onInputChange}
        />
        <PrivateKeyPassphrase
          onChangePassphrase={this.onChangePassphrase.bind(this)}
        />
        <Divider/>
        <div className={this.classes.controls}>
          <StyledToggleButtonGroup
            size={'small'}
            value={this.state.options}
            onChange={this.onOptionChange}
            aria-label="tweet options"
          >
            <ToggleButton value="sign" aria-label="sign">
              <VpnKey/>
            </ToggleButton>
            <ToggleButton value="thread" aria-label="thread">
              <ViewStream/>
            </ToggleButton>
          </StyledToggleButtonGroup>
          <Button
            variant={'contained'}
            color={'secondary'}
            onClick={this.onSubmit}
          >{'Tweet'}</Button>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(TwitterStatus);
