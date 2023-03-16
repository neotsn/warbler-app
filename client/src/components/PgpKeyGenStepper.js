import React, { Component } from 'react';
import { Button, FormControl, FormHelperText, InputLabel, Link, Paper, Select, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import PrivateKeyPassphrase from './PrivateKeyPassphrase';
import UserIdsContainer from './UserIdsContainer';
import LoadingButton from './LoadingButton';
import { useTheme } from '@mui/material/styles';

const styles = makeStyles(() => ({
  root: {
    width: '100%'
  },
  button: {
    marginTop: useTheme().spacing(1),
    marginRight: useTheme().spacing(1)
  },
  actionsContainer: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'flex-end',
    marginTop: useTheme().spacing(1),
    marginBottom: useTheme().spacing(1)
  },
  resetContainer: {
    padding: useTheme().spacing(3)
  },
  formControl: {
    display: 'flex',
    margin: useTheme().spacing(1),
    minWidth: 120,
    width: '100%'
  }
}));

class PgpKeyGenStepper extends Component {
  constructor({ classes, props }) {
    super(props);

    this.classes = classes;
    this.state = {
      activeStep: 0,
      curve: 'curve25519',
      isGenerating: false,
      passphrase: null,
      userIds: []
    };
  }

  doGenerate = (e) => {
    const { curve, passphrase, userIds } = this.state;
    this.setState({ isGenerating: true });

    // this.props.pgp.doKeyGen({ curve, passphrase, userIds });
  };

  doReset = () => {
    this.setState({ activeStep: 0 });
  };

  getSteps = () => {
    const { curves } = this.props;
    return [
      {
        label: 'Select Elliptic Curve',
        content:
          <FormControl className={this.classes.formControl}>
            <InputLabel id={'ecc-curve-label'}>Elliptic Curve</InputLabel>
            <Select
              native
              autoWidth={true}
              labelId={'ecc-curve-label'}
              id={'ecc-curve'}
              name={'ecc-curve'}
              value={this.state.curve}
              onChange={this.onChangeCurve}
            >
              {curves.map((curveKey) => {
                return <option value={curveKey} key={curveKey}>{curveKey}</option>;
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
  };

  onBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  onChangeCurve = (e) => {
    this.setState({ curve: e.currentTarget.value });
  };

  onChangePassphrase = ({ passphrase }) => {
    this.setState({ passphrase });
  };

  onChangeUserIds = ({ userIds }) => {
    this.setState({ userIds });
  };

  onNext = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

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
                <div className={this.classes.actionsContainer}>
                  <Button
                    disabled={this.state.activeStep === 0}
                    onClick={this.onBack}
                    className={this.classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.onNext}
                    className={this.classes.button}
                  >
                    {this.state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {this.state.activeStep === steps.length && (
          <Paper square elevation={0} className={this.classes.resetContainer}>
            <Button onClick={this.doReset} className={this.classes.button}>
              Start Over
            </Button>
            <LoadingButton
              color={'primary'}
              label={'Generate'}
              variant={'contained'}
              onClick={this.doGenerate.bind(this)}
              loading={this.state.isGenerating}
            />
          </Paper>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(PgpKeyGenStepper);
