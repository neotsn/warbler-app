import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { withStyles } from '@mui/styles';

const styles = (theme) => ({
  tabPanel: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%'
  },
  tabPanelContent: {
    width: '100%'
  }
});

class TabPanel extends Component {
  static propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
  };

  constructor({ classes, props }) {
    super(props);

    this.classes = classes;
  }

  render() {
    return (
      <div
        className={this.classes.tabPanel}
        role="tabpanel"
        hidden={this.props.value !== this.props.index}
        id={`full-width-tabpanel-${this.props.index}`}
        aria-labelledby={`full-width-tab-${this.props.index}`}
        {...this.props.other}
      >
        {this.props.value === this.props.index && (
          <Box p={2} className={this.classes.tabPanelContent}>
            <div>
              {this.props.children}
            </div>
          </Box>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(TabPanel);
