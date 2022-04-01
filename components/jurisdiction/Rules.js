import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';

/**
 * A component with jurisdiction rules.
 */
export default function Rules() {
  return (
    <Box sx={{ mb: 12 }}>
      <Typography variant="h1" gutterBottom>
        Rules
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Typography gutterBottom>None</Typography>
    </Box>
  );
}
