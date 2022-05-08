import { Box, Typography } from '@mui/material';
import { REPUTATION_RATING } from 'constants/contracts';
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
      {rule?.effects &&
        rule.effects.map((effect, index) => (
          <RuleEffect
            key={index}
            name={effect.name}
            direction={effect.direction}
            value={effect.value}
            sx={{ my: 0.8 }}
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
        py: 1.2,
        px: 1.8,
        borderRadius: '14px',
        backgroundColor:
          direction === REPUTATION_RATING.positive.direction
            ? 'success.main'
            : 'danger.main',
        ...sx,
      }}
    >
      <IconChart hexColor={palette.primary.contrastText} />
      <Typography variant="body2" sx={{ color: 'primary.contrastText', ml: 1 }}>
        {name}
      </Typography>
      <Typography variant="body2" sx={{ color: 'primary.contrastText', ml: 1 }}>
        {direction === REPUTATION_RATING.positive.direction
          ? `+${value}`
          : `-${value}`}
      </Typography>
    </Box>
  );
}
