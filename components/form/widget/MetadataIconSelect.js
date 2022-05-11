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
import { useState } from 'react';

/**
 * A widget to select icon (name) for metadata.
 */
export default function MetadataIconSelect(props) {
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const [value, setValue] = useState(propsValue || ICON.default.name);

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="metadata-icon-select-label">Icon</InputLabel>
        <Select
          labelId="metadata-icon-select-label"
          id="metadata-icon-select"
          value={value}
          label="Icon"
          onChange={(event) => {
            setValue(event.target.value);
            propsOnChange(event.target.value);
          }}
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
