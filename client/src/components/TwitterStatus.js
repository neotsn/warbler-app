import React, { Component } from 'react';
import { Button, CardContent, TextField } from '@mui/material';
import PrivateKeyPassphrase from './PrivateKeyPassphrase';
import ChirrAppUtils from '../helpers/ChirrAppUtils';

export default class TwitterStatus extends Component {
  constructor({ props } = {}) {
    super(props);

    this.state = {
      characterCount: 0
    };
  }

  makeHelpText() {
    const { content } = this.props;

    const postCount = new ChirrAppUtils()
      .split(content)
      .length;

    return `Will generate ${postCount} tweets`;
  }

  render() {
    // Fields
    const { content } = this.props;

    return (
      <>
        <CardContent>
          <PrivateKeyPassphrase
            onChangePassphrase={this.props.onChangePassphrase}
          />
        </CardContent>
        <CardContent>
          <TextField
            label={'Tweet Content'}
            name={'twitter_tweet'}
            rows={5}
            value={content || ''}
            multiline
            fullWidth={true}
            helperText={this.makeHelpText()}
            onChange={this.props.onChangeContent}
          />
        </CardContent>
        <CardContent>
          <Button
            variant={'contained'}
            color={'secondary'}
            onClick={this.props.onSubmitTweet}
          >{'Tweet'}</Button>
        </CardContent>
      </>
    );
  }
}
