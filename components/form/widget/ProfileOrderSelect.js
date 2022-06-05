import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { PROFILE_ORDER } from 'constants/subgraph';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

/**
 * A widget to select profile order.
 */
export default function ProfileOrderSelect(props) {
  const propsSize = props.size;
  const propsSx = props.sx;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const { t } = useTranslation('common');
  const [value, setValue] = useState(propsValue);

  return (
    <FormControl sx={{ ...propsSx }} size={propsSize}>
      <InputLabel id="profile-order-select-label">{t('text-order')}</InputLabel>
      <Select
        labelId="profile-order-select-label"
        id="profile-order-select"
        value={value}
        label={t('text-order')}
        onChange={(event) => {
          setValue(event.target.value);
          propsOnChange(event.target.value);
        }}
      >
        <MenuItem value={PROFILE_ORDER.byPositiveRating}>
          {t('text-order-by-positive-reputation')}
        </MenuItem>
        <MenuItem value={PROFILE_ORDER.byNegativeRating}>
          {t('text-order-by-negative-reputation')}
        </MenuItem>
      </Select>
    </FormControl>
  );
}
