import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import RuleManageFormDialog from './RuleManageFormDialog';
import RuleList from './RuleList';

/**
 * A component with rule backend.
 */
export default function RuleBackend() {
  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          Rule Backend
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <RuleManageFormDialog />
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <RuleList />
      </Box>
    </>
  );
}
