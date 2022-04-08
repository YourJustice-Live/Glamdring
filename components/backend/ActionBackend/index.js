import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ActionManageFormDialog from './ActionManageFormDialog';
import ActionList from './ActionList';

/**
 * A component with an action backend.
 */
export default function ActionBackend() {
  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          Action Backend
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <ActionManageFormDialog />
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <ActionList />
      </Box>
    </>
  );
}
