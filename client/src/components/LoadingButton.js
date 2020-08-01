import React, { Component } from 'react';
import { Button, CircularProgress, withStyles } from '@material-ui/core';

const styles = (theme) => ({
  spinner: {
    marginLeft: theme.spacing(1)
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
});

class LoadingButton extends Component {
  constructor({ classes, props }) {
    super(props);
    this.classes = classes;
  }

  render() {
    const { color, label, loading, variant } = this.props;

    return (
      <Button
        color={color}
        variant={variant}
        onClick={this.props.onClick}
        className={this.classes.button}
        disabled={loading}
      >
        {label}
        {loading && <CircularProgress className={this.classes.spinner} size={20}/>}
      </Button>
    );
  }
}

export default withStyles(styles)(LoadingButton);
