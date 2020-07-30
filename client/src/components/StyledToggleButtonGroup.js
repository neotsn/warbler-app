import { withStyles } from '@material-ui/core';
import { ToggleButtonGroup } from '@material-ui/lab';

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
