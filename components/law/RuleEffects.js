import { Box, Typography } from '@mui/material';
import { REPUTATION_RATING } from 'constants/contracts';
import { IconChart } from 'icons';
import { capitalize } from 'lodash';
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
        flexDirection: { xs: 'column', md: 'row' },
        ...sx,
      }}
    >
      {rule?.effects &&
        rule.effects.map((effect, index) => (
          <RuleEffect
            key={index}
            name={effect.name}
            direction={effect.direction}
            value={effect.value}
            sx={{ mb: { xs: 0.8, md: 0 }, mr: { xs: 0, md: 1 } }}
          />
        ))}
    </Box>
  );
}

/**
 * A component with specified rule effect.
 */
function RuleEffect({ name, direction, value, sx }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        py: 0.6,
        px: 1.4,
        borderRadius: '8px',
        backgroundColor:
          direction === REPUTATION_RATING.positive.direction
            ? 'success.main'
            : 'danger.main',
        ...sx,
      }}
    >
      <IconChart hexColor={palette.primary.contrastText} size={14} />
      <Typography variant="body2" sx={{ color: 'primary.contrastText', ml: 1 }}>
        {capitalize(name)}
      </Typography>
      <Typography variant="body2" sx={{ color: 'primary.contrastText', ml: 1 }}>
        {direction === REPUTATION_RATING.positive.direction
          ? `+${value}`
          : `-${value}`}
      </Typography>
    </Box>
  );
}
