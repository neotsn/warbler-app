import React, { Component } from 'react';
import LoginButton from '../components/LoginButton';
import { Grid } from '@mui/material';

export default class Feed extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
  }

  render() {
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={8}>

          </Grid>
          <Grid item xs={4}>
            To get started<br/>
            <LoginButton
              doLogin={this.props.doLogin}
            />
          </Grid>
        </Grid>

      </div>
    );
  }
}

