import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

/**
 * Generate a Navigation Item consistently
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const NavigationItem = (props) => {
  return (
    <Link to={props.url}>
      <ListItem button key={props.label}>
        <ListItemIcon>{props.icon || null}</ListItemIcon>
        <ListItemText primary={props.label}/>
      </ListItem>
    </Link>
  );
};

export default NavigationItem;
