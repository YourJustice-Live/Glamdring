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
import useErrors from 'hooks/useErrors';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { formatActionName, formatAddress } from 'utils/formatters';

/**
 * A widget to select action (guid).
 *
 * TODO: Replace with "CaseActionSelect" and use name "ActionSelect".
 */
export default function ActionSelect(props) {
  const propsValue = props.value;
  const propsRequired = props.required;
  const propsOnChange = props.onChange;
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { getActions } = useAction();
  const [value, setValue] = useState('');
  const [actions, setActions] = useState([]);

  useEffect(() => {
    getActions()
      .then((actions) => {
        actions = actions.sort((a, b) =>
          a.action?.subject?.localeCompare(b.action?.subject),
        );
        setActions(actions);
      })
      .catch((error) => handleError(error, true));
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
          {actions.length > 0
            ? t('input-action-title')
            : t('text-actions-are-loading')}
        </InputLabel>
        <Select
          labelId="metadata-action-select-label"
          id="metadata-action-select"
          value={value}
          label={t('input-action-title')}
          onChange={(event) => {
            setValue(event.target.value);
            propsOnChange(event.target.value);
          }}
          disabled={actions.length === 0}
        >
          {actions.map((action, index) => (
            <MenuItem key={index} value={action.guid}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography>{formatActionName(action)}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  ({formatAddress(action.guid)})
                </Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
