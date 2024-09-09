import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Settings, ViewStream } from '@mui/icons-material';
import { Link } from 'react-router-dom';

/**
 * Generate the Navigation Drawer for authenticated users
 */
const Navigation = (props) => {
  const [value, setValue] = React.useState('/');
  const { isAuthenticated } = props;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <nav>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
        >
          <BottomNavigationAction component={Link} to="/feed" label="Feed" icon={<ViewStream/>}/>
          <BottomNavigationAction component={Link} to="/settings" label="Settings" icon={<Settings/>}/>
        </BottomNavigation>
      </nav>
    </Paper>
  );
};

export default Navigation;
