import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { CASE_STAGE } from 'constants/contracts';
import { CASE_STAGE_STRING } from 'constants/strings';
import { isNumber } from 'lodash';
import { useState } from 'react';

/**
 * A widget to select case (id) stage.
 */
export default function CaseStageSelect(props) {
  const propsLabel = props.label;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const [value, setValue] = useState(isNumber(propsValue) ? propsValue : '');

  return (
    <Box>
      {propsLabel && propsLabel !== '' && (
        <>
          <Typography sx={{ fontWeight: 'bold' }}>{propsLabel}</Typography>
          <Divider sx={{ mt: 1.5, mb: 2.5 }} />
        </>
      )}
      <FormControl fullWidth>
        <InputLabel id="case-stage-select-label">Stage</InputLabel>
        <Select
          labelId="case-stage-select-label"
          id="case-stage-select"
          value={value}
          label="Stage"
          onChange={(event) => {
            setValue(event.target.value);
            propsOnChange(event.target.value);
          }}
        >
          <MenuItem value="">Any Stage</MenuItem>
          <MenuItem value={CASE_STAGE.draft}>
            {CASE_STAGE_STRING[CASE_STAGE.draft]}
          </MenuItem>
          <MenuItem value={CASE_STAGE.open}>
            {CASE_STAGE_STRING[CASE_STAGE.open]}
          </MenuItem>
          <MenuItem value={CASE_STAGE.verdict}>
            {CASE_STAGE_STRING[CASE_STAGE.verdict]}
          </MenuItem>
          <MenuItem value={CASE_STAGE.closed}>
            {CASE_STAGE_STRING[CASE_STAGE.closed]}
          </MenuItem>
          <MenuItem value={CASE_STAGE.cancelled}>
            {CASE_STAGE_STRING[CASE_STAGE.cancelled]}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
