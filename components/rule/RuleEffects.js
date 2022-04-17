import { Box, Typography } from '@mui/material';
import { IconChart } from 'icons';
import { palette } from 'theme/palette';

/**
 * A component with rule effects.
 */
export default function RuleEffects({ rule, sx }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'column',
        ...sx,
      }}
    >
      <RuleEffect
        name="Environmental"
        value={rule.rule.effects?.environmental}
      />
      <RuleEffect
        name="Professional"
        value={rule.rule.effects?.professional}
        sx={{ mt: 0.8 }}
      />
      <RuleEffect
        name="Social"
        value={rule.rule.effects?.social}
        sx={{ mt: 0.8 }}
      />
      <RuleEffect
        name="Personal"
        value={rule.rule.effects?.personal}
        sx={{ mt: 0.8 }}
      />
    </Box>
  );
}

/**
 * A component with specified rule effect.
 */
function RuleEffect({ name, value, sx }) {
  if (value && value !== 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          py: 1.2,
          px: 1.8,
          borderRadius: '14px',
          backgroundColor: value > 0 ? 'success.main' : 'danger.main',
          ...sx,
        }}
      >
        <IconChart hexColor={palette.primary.contrastText} />
        <Typography
          variant="body2"
          sx={{ color: 'primary.contrastText', ml: 1 }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'primary.contrastText', ml: 1 }}
        >
          {value > 0 ? `+${value}` : value}
        </Typography>
      </Box>
    );
  } else {
    return null;
  }
}
