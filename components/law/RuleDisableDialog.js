import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useErrors from 'hooks/useErrors';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A dialog for disable (mark as obsolete) a jurisdiction rule.
 *
 * TODO: Move strings to localization file.
 */
export default function RuleDisableDialog({
  jurisdiction,
  rule,
  isClose,
  onClose,
}) {
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { setRuleDisableStatus } = useJuridictionContract();
  const [isOpen, setIsOpen] = useState(!isClose);
  const [isLoading, setIsLoading] = useState(false);

  function close() {
    setIsLoading(false);
    setIsOpen(false);
    onClose();
  }

  async function submit() {
    try {
      setIsLoading(true);
      await setRuleDisableStatus(jurisdiction?.id, rule?.ruleId, true);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      handleError(error, true);
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? null : close}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Mark rule as obsolete</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Are you sure you want to mark as obsolete the rule &quot;
          <b>{rule.rule?.uriData?.name || 'Unnamed rule'}</b>&quot;?
        </Typography>
        <Typography gutterBottom>This action cannot be undone.</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
          {isLoading ? (
            <LoadingButton
              loading
              loadingPosition="start"
              startIcon={<Save />}
              variant="outlined"
            >
              Processing
            </LoadingButton>
          ) : (
            <>
              <Button
                variant="contained"
                type="submit"
                onClick={() => submit()}
              >
                Mark as Obsolete
              </Button>
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
