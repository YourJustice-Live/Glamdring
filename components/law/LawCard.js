import {
  Avatar,
  Card,
  CardContent,
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
            {law.actionUriData.name}
          </Typography>
        </Stack>
        {/* Description */}
        <Box sx={{ mt: 2 }}>
          <Typography>{law.actionUriData.description}</Typography>
        </Box>
        {/* Rules */}
        <Stack direction="column" spacing={1} sx={{ mt: 3 }}>
          {law.rules.map((lawRule, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
                {lawRule.ruleUriData.name}
              </Typography>
              <Typography>{lawRule.ruleUriData.description}</Typography>
              <Box sx={{ mt: 2 }}>
                <RuleEffects rule={lawRule.rule} />
              </Box>
            </Paper>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
