import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { PROFILE_ORDER } from 'constants/subgraph';
import { useState } from 'react';

/**
 * A widget to select profile order.
 */
export default function ProfileOrderSelect(props) {
  const propsSize = props.size;
  const propsSx = props.sx;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const [value, setValue] = useState(propsValue);

  return (
    <FormControl sx={{ ...propsSx }} size={propsSize}>
      <InputLabel id="profile-order-select-label">Order</InputLabel>
      <Select
        labelId="profile-order-select-label"
        id="profile-order-select"
        value={value}
        label="Order"
        onChange={(event) => {
          setValue(event.target.value);
          propsOnChange(event.target.value);
        }}
      >
        <MenuItem value={PROFILE_ORDER.byPositiveRating}>
          Order by Positive Reputation
        </MenuItem>
        <MenuItem value={PROFILE_ORDER.byNegativeRating}>
          Order by Negative Reputation
        </MenuItem>
      </Select>
    </FormControl>
  );
}
