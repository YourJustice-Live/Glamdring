import { Button, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useDialogContext from 'hooks/useDialogContext';
import ActionList from './ActionList';
import ActionManageDialog from './ActionManageDialog';

/**
 * A component with an action backend.
 */
export default function ActionBackend() {
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          Action Backend
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <Button
          variant="outlined"
          onClick={() =>
            showDialog(<ActionManageDialog onClose={closeDialog} />)
          }
        >
          Add Action
        </Button>
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <ActionList />
      </Box>
    </>
  );
}
