import { Button, ButtonGroup } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';

/**
 * A widget to select positive or negative laws.
 */
export default function LawsPositivitySelect(props) {
  const propsHeader = props.options?.header;
  const propsSx = props.sx;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const { t } = useTranslation('common');

  return (
    <Box sx={{ ...propsSx }}>
      {propsHeader}
      <ButtonGroup sx={{ display: 'flex', flexDirection: 'row' }}>
        <Button
          color="success"
          variant={propsValue ? 'contained' : 'outlined'}
          sx={{ flex: 1 }}
          onClick={() => propsOnChange(true)}
        >
          {t('text-laws-positive')}
        </Button>
        <Button
          color="danger"
          variant={!propsValue ? 'contained' : 'outlined'}
          sx={{ flex: 1 }}
          onClick={() => propsOnChange(false)}
        >
          {t('text-laws-negative')}
        </Button>
      </ButtonGroup>
    </Box>
  );
}
