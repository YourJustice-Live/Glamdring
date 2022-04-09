import { Button, Divider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useDialogContext from 'hooks/useDialogContext';
import RoleManageDialog from './RoleManageDialog';

/**
 * A component with a role backend.
 */
export default function RoleBackend() {
  const { showDialog, closeDialog } = useDialogContext();

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
    </>
  );
}
