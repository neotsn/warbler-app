import React, { Component } from 'react';
import TwitterStatus from '../components/TwitterStatus';
import { Divider } from '@mui/material';
import Twitter from '../helpers/Twitter';

export default class Feed extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
    this.state = {
      content: '',
      passphrase: ''
    };
  }

  componentDidMount() {
    this.socket = this.props.socket;
  }

  onChangeContent(e) {
    this.setState({ content: e.target.value });
  }

  onChangePassphrase({ passphrase } = {}) {
    this.setState({ passphrase });
  }

  onSubmitTweet(e) {
    e.preventDefault();
    const { content, passphrase } = this.state;

    new Twitter({ content, passphrase })
      .processContent()
      .then((tweets) => {
        this.props.onSubmitTweet({ tweets, passphrase });
      });
  }

  render() {
    return (
      <div>
        <TwitterStatus
          content={this.state.content}
          options={this.state.options}
          onChangeContent={this.onChangeContent.bind(this)}
          onChangePassphrase={this.onChangePassphrase.bind(this)}
          onSubmitTweet={this.onSubmitTweet.bind(this)}
        />
        <Divider/>
        {/* TODO Add the Twitter Feed Here */}
      </div>
    );
  }
}

