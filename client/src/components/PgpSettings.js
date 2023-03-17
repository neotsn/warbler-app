import React, { Component } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Tab, Tabs, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import TabPanel from './TabPanel';
import PgpKeyGenStepper from './PgpKeyGenStepper';
import { ExpandMore } from '@mui/icons-material';

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
      <Accordion variant="outlined">
        <AccordionSummary
          expandIcon={<ExpandMore/>}
          aria-controls="pgp-config-content"
          id="pgp-config-header"
        >
          <Typography>PGP Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
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
          <TabPanel value={this.state.tab} index={0} dir={'ltr'}>
            <PgpKeyGenStepper
              curves={['curve25519']}
            />
          </TabPanel>
          <TabPanel value={this.state.tab} index={1} dir={'ltr'}>
            Add Upload Functionality
          </TabPanel>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default withStyles(styles)(PgpSettings);
