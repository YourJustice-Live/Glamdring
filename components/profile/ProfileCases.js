import { Divider, Typography } from '@mui/material';

/**
 * A component with profile cases.
 */
export default function ProfileCases() {
  return (
    <>
      <Typography variant="h1" gutterBottom>
        Cases
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Typography gutterBottom>None</Typography>
    </>
  );
}
