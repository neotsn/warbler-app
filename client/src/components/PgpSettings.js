import React, { Component } from 'react';
import { AppBar, Paper, Tab, Tabs } from '@mui/material';
import { withStyles } from '@mui/styles';
import TabPanel from './TabPanel';
import PgpKeyGenStepper from './PgpKeyGenStepper';

const styles = (theme) => ({
  paper: {
    display: 'flex',
    margin: '0 auto',
    width: '50vw',
    border: `1px solid ${theme.palette.divider}`,
    flexWrap: 'wrap',
    padding: theme.spacing(1)
  },
  formRow: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

class PgpSettings extends Component {
  constructor({ classes, props }) {
    super(props);

    this.classes = classes;
    this.state = {
      tab: 0 // 0: generate, 1: upload
    };
  }

  onChangeTab = (e, newValue) => {
    this.setState({ tab: newValue });
  };

  render() {
    return (
      <Paper
        elevation={1}
        className={this.classes.paper}
      >
        <AppBar position={'static'} color={'default'}>
          <Tabs
            value={this.state.tab}
            onChange={this.onChangeTab}
            indicatorColor={'primary'}
            textColor={'inherit'}
            centered
            aria-label="pgp key source"
          >
            <Tab label={'Generate Keys'}/>
            <Tab label={'Upload Keys'}/>
          </Tabs>
        </AppBar>
        <TabPanel value={this.state.tab} index={0} dir={'ltr'}>
          <PgpKeyGenStepper
            curves={this.props.curves}
          />
        </TabPanel>
        <TabPanel value={this.state.tab} index={1} dir={'ltr'}>
          Add Upload Functionality
        </TabPanel>
      </Paper>
    );
  }
}

export default withStyles(styles)(PgpSettings);
