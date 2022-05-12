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
import { capitalize, isNumber } from 'lodash';
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
          <MenuItem value="">Any</MenuItem>
          <MenuItem value={CASE_STAGE.draft.id}>
            {capitalize(CASE_STAGE.draft.name)}
          </MenuItem>
          <MenuItem value={CASE_STAGE.open.id}>
            {capitalize(CASE_STAGE.open.name)}
          </MenuItem>
          <MenuItem value={CASE_STAGE.verdict.id}>
            {capitalize(CASE_STAGE.verdict.name)}
          </MenuItem>
          <MenuItem value={CASE_STAGE.closed.id}>
            {capitalize(CASE_STAGE.closed.name)}
          </MenuItem>
          <MenuItem value={CASE_STAGE.cancelled.id}>
            {capitalize(CASE_STAGE.cancelled.name)}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
