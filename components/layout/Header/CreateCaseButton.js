import { Button, Skeleton } from '@mui/material';
import { Box } from '@mui/system';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import useDialogContext from 'hooks/useDialogContext';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import { IconPlus } from 'icons';
import { useEffect, useState } from 'react';

/**
 * A component with a create case button for navigation.
 */
export default function CreateCaseButton() {
  const { showDialog, closeDialog } = useDialogContext();
  const { showToastError } = useToasts();
  const { getJurisdiction } = useJurisdiction();
  const [jurisdiction, setJurisdiction] = useState(null);

  useEffect(() => {
    getJurisdiction(process.env.NEXT_PUBLIC_MAIN_JURISDICTION_CONTRACT_ADDRESS)
      .then((jurisdiction) => setJurisdiction(jurisdiction))
      .catch((error) => showToastError(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      {jurisdiction ? (
        <Button
          variant="secondary"
          sx={{ display: { xs: 'none', md: 'flex' } }}
          startIcon={<IconPlus />}
          onClick={() =>
            showDialog(
              <CaseCreateDialog
                jurisdiction={jurisdiction}
                onClose={closeDialog}
              />,
            )
          }
        >
          Create Case
        </Button>
      ) : (
        <Skeleton variant="rectangular" height={22} width={164} />
      )}
    </Box>
  );
}
