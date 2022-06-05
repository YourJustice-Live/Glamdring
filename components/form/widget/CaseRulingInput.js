import { Divider, Paper, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';

/**
 * A widget to input ruling (non-interactive).
 */
export default function CaseRulingInput(props) {
  const propsLabel = props.label;
  const propsType = props.options?.type;
  const { t } = useTranslation('common');

  return (
    <>
      <Typography sx={{ fontWeight: 'bold' }}>{propsLabel}</Typography>
      <Divider sx={{ mt: 1.5, mb: 2.5 }} />
      <Paper variant="outlined" sx={{ p: 2 }}>
        {propsType === 'judge' ? (
          <Typography>{t('text-rule-ruling-judge-description')}</Typography>
        ) : (
          <Typography>
            {t('text-rule-ruling-type-is')}{' '}
            <b>&apos;{propsType || t('text-unknown').toLowerCase()}&apos;</b>.
          </Typography>
        )}
      </Paper>
    </>
  );
}
