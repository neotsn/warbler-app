import React, { Component } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import TabPanel from './TabPanel';
import PgpKeyGenStepper from './PgpKeyGenStepper';
import { ExpandMore } from '@mui/icons-material';
import * as openpgp from 'openpgp';
import { DB_TABLES } from '../constants';
import Database from '../helpers/Database';

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
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
    this.db = Database;
    this.state = {
      hasKeys: false,
      isGenerating: false,
      tab: 0 // 0: view, 1: generate, 2: upload,
    };
  }

  checkForKeys() {
    const publicKey = this.db.getField({ field: DB_TABLES.PGP_PUBLIC, fromBase64: true });
    const privateKey = this.db.getField({ field: DB_TABLES.PGP_PRIVATE, fromBase64: true });

    const hasKeys = !!(publicKey && publicKey.length && privateKey && privateKey.length);
    this.setState({ hasKeys });
    this.setState({ tab: (hasKeys ? 0 : 1) });
  }

  componentDidMount() {
    this.checkForKeys();
  }

  doKeyGen({ curve, passphrase, userIDs }) {
    (async () => {
      this.setState({ isGenerating: true });
      const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey({
        type: 'ecc',
        curve,
        userIDs,
        passphrase,
        format: 'armored'
      });

      // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
      this.db.setField({
        field: DB_TABLES.PGP_PRIVATE,
        value: privateKey,
        asBase64: true
      });

      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
      this.db.setField({
        field: DB_TABLES.PGP_PUBLIC,
        value: publicKey,
        asBase64: true
      });

      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
      this.db.setField({
        field: DB_TABLES.PGP_REVOKE,
        value: revocationCertificate,
        asBase64: true
      });

      this.setState({ isGenerating: false });
      this.checkForKeys();
    })();
  }

  onChangeTab(e, newValue) {
    this.setState({ tab: newValue });
  };

  render() {
    const { user } = this.props;
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
            onChange={this.onChangeTab.bind(this)}
            indicatorColor={'primary'}
            textColor={'inherit'}
            centered
            aria-label="pgp key source"
          >
            <Tab label={'View Keys'}/>
            <Tab label={'Generate Keys'}/>
            <Tab label={'Upload Keys'}/>
          </Tabs>
          <TabPanel value={this.state.tab} index={0} dir={'ltr'}>
            <Stack spacing={2} direction={'column'}>
              {this.state.hasKeys === false && (
                <Alert variant={'outlined'} severity={'info'}>
                  You must first Generate or Upload your PGP Public & Private key.
                </Alert>
              )}
              {this.state.hasKeys === true && (
                <Alert variant={'outlined'} severity={'info'}>
                  These keys are only stored in this broswer. If you want to use them elsewhere, copy them, and save them to a text file.
                </Alert>
              )}
              <TextField
                label={'Public Key'}
                multiline
                disabled={true}
                defaultValue={this.db.getField({ field: DB_TABLES.PGP_PUBLIC, fromBase64: true })}
              />
              <TextField
                label={'Private Key'}
                multiline
                disabled={true}
                defaultValue={this.db.getField({ field: DB_TABLES.PGP_PRIVATE, fromBase64: true })}
              />
              <TextField
                label={'Revocation Certificate'}
                multiline
                disabled={true}
                defaultValue={this.db.getField({ field: DB_TABLES.PGP_REVOKE, fromBase64: true })}
              />
            </Stack>
          </TabPanel>
          <TabPanel value={this.state.tab} index={1} dir={'ltr'}>
            {this.state.hasKeys === true && (
              <Alert variant={'outlined'} severity={'warning'}>
                You already have keys stored in the browser. This will overwrite them, but not revoke them.
              </Alert>
            )}
            <PgpKeyGenStepper
              curves={['curve25519', 'ed25519']}
              doKeyGen={this.doKeyGen.bind(this)}
              isGenerating={this.state.isGenerating}
              user={user}
            />
          </TabPanel>
          <TabPanel value={this.state.tab} index={2} dir={'ltr'}>
            Add Upload Functionality
          </TabPanel>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default withStyles(styles)(PgpSettings);
