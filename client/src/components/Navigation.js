import React, { Component } from 'react';
import { Divider, Drawer, List, Toolbar, withStyles } from '@material-ui/core';
import NavigationItem from './NavigationItem';
import { Settings as SettingsIcon, ViewStream } from '@material-ui/icons';

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerContainer: {
    overflow: 'auto'
  }
});

/**
 * Generate the Navigation Drawer for authenticated users
 * @param classes
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
class Navigation extends Component {
  constructor({ classes, props } = {}) {
    super(props);

    this.classes = classes;
  }

  render() {
    const { drawer, drawerPaper, drawerContainer } = this.classes;
    const { isAuthenticated } = this.props;

    if (!isAuthenticated) {
      // Not Authenticated, no Navigation to display
      return null;
    }

    return (
      <Drawer
        className={drawer}
        variant={'permanent'}
        classes={{ paper: drawerPaper }}
      >
        <Toolbar/>
        <div className={drawerContainer}>
          <List>
            <NavigationItem url={'/feed'} label={'Feed'} icon={<ViewStream/>}/>
            <NavigationItem url={'/settings'} label={'Settings'} icon={<SettingsIcon/>}/>
          </List>
          <Divider/>
          <List>
            <NavigationItem url={'/logout'} label={'Logout'} icon={''}/>
          </List>
        </div>
      </Drawer>
    );
  }
};

export default withStyles(styles)(Navigation);
