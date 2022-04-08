import { Divider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import RoleAssignFormDialog from './RoleAssingFormDialog';
import RoleRemoveFormDialog from './RoleRemoveFormDialog';

/**
 * A component with a role backend.
 */
export default function RoleBackend() {
  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          Role Backend
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <Stack direction="row" spacing={2}>
          <RoleAssignFormDialog />
          <RoleRemoveFormDialog />
        </Stack>
      </Box>
    </>
  );
}
