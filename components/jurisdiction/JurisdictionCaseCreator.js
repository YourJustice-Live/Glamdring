import { Button, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import useDialogContext from 'hooks/useDialogContext';
import { IconPlus } from 'icons';
import { palette } from 'theme/palette';

/**
 * A component with jurisdiction case creator.
 */
export default function JurisdictionCaseCreator() {
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <>
      <Box>
        <Typography variant="h1" gutterBottom>
          Case Creator
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<IconPlus hexColor={palette.primary.contrastText} />}
          onClick={() => showDialog(<CaseCreateDialog onClose={closeDialog} />)}
        >
          Create Case
        </Button>
      </Box>
    </>
  );
}
