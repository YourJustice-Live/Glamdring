import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useAction from 'hooks/useAction';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';
import { getActionIcon } from 'utils/metadata';

/**
 * A widget to select action (guid).
 */
export default function ActionSelect(props) {
  const propsValue = props.value;
  const propsRequired = props.required;
  const propsOnChange = props.onChange;
  const { showToastError } = useToasts();
  const { getActions } = useAction();
  const [value, setValue] = useState('');
  const [actions, setActions] = useState([]);

  useEffect(() => {
    getActions()
      .then((actions) => setActions(actions))
      .catch((error) => showToastError(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (actions && actions.length > 0) {
      if (propsValue) {
        setValue(propsValue);
      } else {
        setValue(actions[0].guid);
        propsOnChange(actions[0].guid);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions]);

  return (
    <Box>
      <FormControl required={propsRequired} fullWidth>
        <InputLabel id="metadata-action-select-label">
          {actions.length > 0 ? 'Action' : ' Actions are loading...'}
        </InputLabel>
        <Select
          labelId="metadata-action-select-label"
          id="metadata-action-select"
          value={value}
          label="Action"
          onChange={(event) => {
            setValue(event.target.value);
            propsOnChange(event.target.value);
          }}
          disabled={actions.length === 0}
        >
          {actions.map((action, index) => (
            <MenuItem key={index} value={action.guid}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {getActionIcon(action, 28)}
                <Typography>{action.uriData?.name}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
