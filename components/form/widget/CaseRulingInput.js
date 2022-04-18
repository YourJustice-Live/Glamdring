import { Divider, Paper, Typography } from '@mui/material';

/**
 * A widget to input ruling (non-interactive).
 */
export default function CaseRulingInput(props) {
  const propsLabel = props.label;
  const propsType = props.options?.type;

  return (
    <>
      <Typography sx={{ fontWeight: 'bold' }}>{propsLabel}</Typography>
      <Divider sx={{ mt: 1.5, mb: 2.5 }} />
      <Paper variant="outlined" sx={{ p: 2 }}>
        {propsType === 'judge' ? (
          <Typography>
            Judge will be selected <b>randomly</b>. To avoid bias and
            corruption.
          </Typography>
        ) : (
          <Typography>
            Ruling type is <b>&apos;{propsType || 'unknown'}&apos;</b>.
          </Typography>
        )}
      </Paper>
    </>
  );
}
