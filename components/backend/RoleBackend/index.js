import { Button, Divider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useDialogContext from 'hooks/useDialogContext';
import RoleManageDialog from './RoleManageDialog';

/**
 * A component with a role backend.
 */
export default function RoleBackend({ sx }) {
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <Box sx={{ ...sx }}>
      <Box>
        <Typography variant="h2" gutterBottom>
          Backend for Jurisdiction Roles
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() =>
              showDialog(
                <RoleManageDialog isAssign={true} onClose={closeDialog} />,
              )
            }
          >
            Assign Role
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              showDialog(
                <RoleManageDialog isAssign={false} onClose={closeDialog} />,
              )
            }
          >
            Remove Role
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
