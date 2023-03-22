import React, { Component } from 'react';
import { Button, FormControl, FormHelperText, InputLabel, Link, MenuItem, Select, Stack, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import { withStyles } from '@mui/styles';
import PrivateKeyPassphrase from './PrivateKeyPassphrase';
import UserIdsContainer from './UserIdsContainer';
import LoadingButton from './LoadingButton';

const styles = theme => ({
  root: {
    width: '100%'
  },
  buttonRow: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'flex-end',
    paddingTop: theme.spacing(1)
  },
  actionsContainer: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  finishContainer: {
    padding: theme.spacing(3)
  },
  formControl: {
    display: 'flex',
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%'
  }
});

class PgpKeyGenStepper extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
    this.state = {
      activeStep: 0,
      curve: 'curve25519',
      passphrase: null,
      userIds: []
    };
  }

  doGenerate(e) {
    const { curve, passphrase, userIds } = this.state;
    this.setState({ isGenerating: true });

    // this.props.pgp.doKeyGen({ curve, passphrase, userIds });
  };

  doReset() {
    this.setState({ activeStep: 0 });
  };

  getSteps() {
    const { curves } = this.props;
    return [
      {
        label: 'Select Elliptic Curve',
        content:
          <FormControl className={this.classes.formControl}>
            <InputLabel id={'ecc-curve-label'}>Elliptic Curve</InputLabel>
            <Select
              label={'Elliptic Curve'}
              labelId={'ecc-curve-label'}
              id={'ecc-curve'}
              name={'ecc-curve'}
              value={this.state.curve}
              onChange={this.onChangeCurve.bind(this)}
            >
              {curves.map((curveKey) => {
                return <MenuItem value={curveKey} key={curveKey}>{curveKey}</MenuItem>;
              })}
            </Select>
            <FormHelperText variant={'standard'}>
              {'The type of encryption curve used in key generation. Default: '}
              <Link href={'https://en.wikipedia.org/wiki/Curve25519'} target={'_blank'}>curve25519</Link>
            </FormHelperText>
          </FormControl>
      }, {
        label: 'Set Private Key Passphrase',
        content: <PrivateKeyPassphrase onChangePassphrase={this.onChangePassphrase.bind(this)}/>
      }, {
        label: 'Add User IDs',
        content: <UserIdsContainer onChangeUserIds={this.onChangeUserIds.bind(this)}/>
      }
    ];
  }

  onBack() {
    this.setState({ activeStep: this.state.activeStep - 1 });
  }

  onChangeCurve(e) {
    this.setState({ curve: e.target.value });
  }

  onChangePassphrase({ passphrase }) {
    this.setState({ passphrase });
  }

  onChangeUserIds({ userIds }) {
    this.setState({ userIds });
  };

  onNext() {
    this.setState({ activeStep: this.state.activeStep + 1 });
  }

  render() {
    const steps = this.getSteps();

    return (
      <div className={this.classes.root}>
        <Stepper activeStep={this.state.activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                {step.content}
                <Stack spacing={2} direction={'row'} className={this.classes.buttonRow}>
                  <Button
                    disabled={this.state.activeStep === 0}
                    onClick={this.onBack.bind(this)}
                  > Previous </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onNext.bind(this)}
                  >
                    {this.state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </Stack>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {this.state.activeStep === steps.length && (
          <Stack spacing={2} direction={'row'} className={this.classes.finishContainer}>
            <Button
              onClick={this.doReset.bind(this)}
            > Start Over </Button>
            <LoadingButton
              color={'primary'}
              label={'Generate'}
              variant={'contained'}
              onClick={this.doGenerate.bind(this)}
              loading={this.props.isGenerating}
            />
          </Stack>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(PgpKeyGenStepper);
