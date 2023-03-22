import React, { Component } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import PgpSettings from '../components/PgpSettings';

/**
 * The settings page to handle Key upload/generation and adjusting the Twitter Profile Description
 */
export default class Settings extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
  }

  render() {
    const { user } = this.props;
    return (
      <Card>
        <React.Fragment>
          <CardContent>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Settings
            </Typography>
            <PgpSettings
              user={user}
            />
            {/*{this.props.children}*/}
          </CardContent>
        </React.Fragment>
      </Card>
    );
  }
}
