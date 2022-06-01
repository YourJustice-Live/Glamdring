import {
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
} from '@mui/icons-material';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';

/**
 * A component with buttons to add rating (reputation).
 *
 * TODO: Automatically open a dialog for creating a case with negative laws if the user clicks the red button "Add Score"
 */
export default function ProfileRatingActions({ profile, sx }) {
  const { accountProfile } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();

  if (profile) {
    return (
      <Box sx={{ display: 'flex', ...sx }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddBoxOutlined />}
          sx={{ flex: 1, mr: 2 }}
          onClick={() =>
            showDialog(
              <CaseCreateDialog
                subjectProfile={profile}
                affectedProfile={accountProfile}
                onClose={closeDialog}
              />,
            )
          }
        >
          Add Reputation
        </Button>
        <Button
          variant="contained"
          color="danger"
          startIcon={<IndeterminateCheckBoxOutlined />}
          sx={{ flex: 1 }}
          onClick={() =>
            showDialog(
              <CaseCreateDialog
                subjectProfile={profile}
                affectedProfile={accountProfile}
                onClose={closeDialog}
              />,
            )
          }
        >
          Add Reputation
        </Button>
      </Box>
    );
  }

  return <></>;
}
