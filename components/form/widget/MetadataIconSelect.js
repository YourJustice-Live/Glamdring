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
 * A widget to select icon (name) for metadata.
 */
export default function MetadataIconSelect(props) {
  const propsValue = props.value;
  const propsRequired = props.required;
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
        <InputLabel id="metadata-icon-select-label">
          {t('input-icon-title')}
        </InputLabel>
        <Select
          labelId="metadata-icon-select-label"
          id="metadata-icon-select"
          value={value}
          label={t('input-icon-title')}
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
