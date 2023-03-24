import { withStyles } from '@mui/styles';
import { ToggleButtonGroup } from '@mui/material';

const StyledToggleButtonGroup = withStyles((theme) => ({
  grouped: {
    display: 'flex',
    margin: theme.spacing(0.5),
    border: 'none',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius
    }
  }
}))(ToggleButtonGroup);

export default StyledToggleButtonGroup;
