import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Box } from '@mui/system';
import { CASE_STAGE } from 'constants/contracts';
import { CASE_STAGE_KEY } from 'constants/i18n';
import { isNumber } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

/**
 * A widget to select case (id) stage.
 */
export default function CaseStageSelect(props) {
  const { t } = useTranslation('common');
  const propsHeader = props.options?.header;
  const propsLabel = props.label;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const [value, setValue] = useState(isNumber(propsValue) ? propsValue : '');

  return (
    <Box>
      {propsHeader}
      <FormControl fullWidth>
        <InputLabel id="case-stage-select-label">
          {propsLabel || 'Case Stage'}
        </InputLabel>
        <Select
          labelId="case-stage-select-label"
          id="case-stage-select"
          value={value}
          label={propsLabel || 'Case Stage'}
          onChange={(event) => {
            setValue(event.target.value);
            propsOnChange(event.target.value);
          }}
        >
          <MenuItem value="">{t('case-stage-any')}</MenuItem>
          <MenuItem value={CASE_STAGE.draft}>
            {t(CASE_STAGE_KEY[CASE_STAGE.draft])}
          </MenuItem>
          <MenuItem value={CASE_STAGE.open}>
            {t(CASE_STAGE_KEY[CASE_STAGE.open])}
          </MenuItem>
          <MenuItem value={CASE_STAGE.verdict}>
            {t(CASE_STAGE_KEY[CASE_STAGE.verdict])}
          </MenuItem>
          <MenuItem value={CASE_STAGE.closed}>
            {t(CASE_STAGE_KEY[CASE_STAGE.closed])}
          </MenuItem>
          <MenuItem value={CASE_STAGE.cancelled}>
            {t(CASE_STAGE_KEY[CASE_STAGE.cancelled])}
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
