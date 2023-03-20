import React, { Component } from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Close } from '@mui/icons-material';

const styles = theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    }
  }
});

class TransitionAlert extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.handle = null;
    this.classes = classes;
    this.state = {
      // Default open so that the message shows when re-rendered
      open: true
    };
  }

  componentDidMount() {
    this.handle = setTimeout(() => {
      this.onClose();
    }, 10 * 1000); // 10 seconds
  }

  onClose() {
    clearTimeout(this.handle);
    this.setState({ open: false });
  }

  render() {
    return (
      <div className={this.classes.root}>
        <Collapse in={this.state.open}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={this.onClose.bind(this)}
              >
                <Close fontSize="inherit"/>
              </IconButton>
            }
            severity={this.props.severity}
          >
            {this.props.content}
          </Alert>
        </Collapse>
      </div>
    );
  }
}

export default withStyles(styles)(TransitionAlert);
