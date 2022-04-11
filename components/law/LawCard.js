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
              <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}>
                <Effect
                  name="Environmental"
                  value={lawRule.rule.rule.effects?.environmental}
                />
                <Effect
                  name="Professional"
                  value={lawRule.rule.rule.effects?.professional}
                />
                <Effect
                  name="Social"
                  value={lawRule.rule.rule.effects?.social}
                />
                <Effect
                  name="Personal"
                  value={lawRule.rule.rule.effects?.personal}
                />
              </Box>
            </Paper>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * Effect component.
 *
 * @param {{name: string, value: number}} params Effect params.
 * @returns Effect component.
 */
function Effect({ name, value }) {
  if (value && value !== 0) {
    return (
      <Chip
        label={`${name} ${value}`}
        sx={{ mr: 1 }}
        color={value > 0 ? 'success' : 'danger'}
      />
    );
  } else {
    return null;
  }
}
