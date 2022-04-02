import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';

/**
 * A component with jurisdiction cases.
 */
export default function JurisdictionCases() {
  return (
    <Box sx={{ mb: 12 }}>
      <Typography variant="h1" gutterBottom>
        Cases
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Typography gutterBottom>None</Typography>
    </Box>
  );
}
