import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import RuleEffects from 'components/rule/RuleEffects';

/**
 * A component with a card with law.
 */
export default function LawCard({ law }) {
  return (
    <Card elevation={1}>
      {/* Avatar with name */}
      <CardContent sx={{ p: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>L</Avatar>
          <Typography sx={{ fontWeight: 'bold' }}>
            {law.action.uriData.name}
          </Typography>
        </Stack>
        {/* Description */}
        <Box sx={{ mt: 2 }}>
          <Typography>{law.action.uriData.description}</Typography>
        </Box>
        {/* Rules */}
        <Stack direction="column" spacing={1} sx={{ mt: 3 }}>
          {law.rules.map((rule, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {rule.rule.uriData.name}
                </Typography>
                <Chip label={`ID: ${rule.id}`} size="small" />
              </Stack>
              <Typography sx={{ mt: 1 }}>
                {rule.rule.uriData.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <RuleEffects rule={rule} />
              </Box>
            </Paper>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
