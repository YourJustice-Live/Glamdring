import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { ICON } from 'constants/metadata';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

/**
 * A widget to select icon (name).
 */
export default function IconSelect(props) {
  const propsLabel = props.label;
  const propsRequired = props.required;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const { t } = useTranslation('common');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (propsValue) {
      setValue(propsValue);
    } else {
      setValue(ICON.default.name);
      propsOnChange(ICON.default.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <FormControl required={propsRequired} fullWidth>
        <InputLabel id="icon-select-label">
          {propsLabel || t('input-icon-title')}
        </InputLabel>
        <Select
          labelId="icon-select-label"
          id="icon-select"
          value={value}
          label={propsLabel || t('input-icon-title')}
          onChange={(event) => {
            setValue(event.target.value);
            propsOnChange(event.target.value);
          }}
          disabled={value === ''}
        >
          {Object.values(ICON).map((icon, index) => (
            <MenuItem key={index} value={icon.name}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {icon.icon(48)}
                <Typography>{icon.name}</Typography>
              </Stack>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
