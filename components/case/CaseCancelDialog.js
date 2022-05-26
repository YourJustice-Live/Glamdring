import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import CancellationMetadata from 'classes/metadata/CancellationMetadata';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useErrors from 'hooks/useErrors';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';
import { handleCancelCaseEvent } from 'utils/analytics';

/**
 * A component with dialog for cancel case.
 */
export default function CaseCancelDialog({ caseObject, isClose, onClose }) {
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { uploadJsonToIPFS } = useIpfs();
  const { setStageCancelled } = useCaseContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['message'],
    properties: {
      message: {
        type: 'string',
        title: 'Message',
      },
    },
  };

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
    onClose();
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      const { url: cancellationMetadataUri } = await uploadJsonToIPFS(
        new CancellationMetadata(formData.message),
      );
      await setStageCancelled(caseObject.id, cancellationMetadataUri);
      handleCancelCaseEvent(caseObject.id);
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
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Cancel Case</DialogTitle>
      <DialogContent>
        <Typography>
          Describe the reason why you want to cancel the case.
        </Typography>
        <Divider sx={{ my: 1.5 }} />
        <Form
          schema={schema}
          formData={formData}
          onSubmit={submit}
          disabled={isLoading}
        >
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
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
                <Button variant="contained" type="submit">
                  Cancel Case
                </Button>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
