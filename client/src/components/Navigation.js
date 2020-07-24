import React from 'react';
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
const Navigation = (classes, props) => {
  // Not Authenticated, no Navigation to display
  if (!props.isAuthenticated) {
    return null;
  }

  return (
    <Drawer
      className={classes.drawer}
      variant={'permanent'}
      classes={{ paper: classes.drawerPaper }}
    >
      <Toolbar/>
      <div className={classes.drawerContainer}>
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
};

export default withStyles(styles)(Navigation);
