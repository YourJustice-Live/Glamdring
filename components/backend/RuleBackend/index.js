import { Button, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import useDialogContext from 'hooks/useDialogContext';
import RuleList from './RuleList';
import RuleManageDialog from './RuleManageDialog';

/**
 * A component with rule backend.
 */
export default function RuleBackend() {
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          Rule Backend
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <Button
          variant="outlined"
          onClick={() => showDialog(<RuleManageDialog onClose={closeDialog} />)}
        >
          Add Rule
        </Button>
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <RuleList />
      </Box>
    </>
  );
}
