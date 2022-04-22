import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { CASE_STAGE } from 'constants/contracts';
import { capitalize } from 'lodash';
import { useState } from 'react';

/**
 * A widget to select case stage.
 */
export default function CaseStageSelect(props) {
  const propsSize = props.size;
  const propsSx = props.sx;
  const propsOnChange = props.onChange;
  const [value, setValue] = useState('');

  return (
    <FormControl sx={{ ...propsSx }} size={propsSize}>
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
  );
}
