import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import VerdictMetadata from 'classes/metadata/VerdictMetadata';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A component with dialog for make case verdict.
 */
export default function CaseVerdictMakeDialog({
  caseObject,
  isClose,
  onClose,
}) {
  const { showToastSuccess, showToastError } = useToasts();
  const { uploadJsonToIPFS } = useIpfs();
  const { setStageClosed } = useCaseContract();
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
      const { url: verdictMetadataUri } = await uploadJsonToIPFS(
        new VerdictMetadata(formData.message),
      );
      await setStageClosed(caseObject.id, verdictMetadataUri);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
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
      <DialogTitle>Make Verdict</DialogTitle>
      <DialogContent>
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
                  Make Verdict
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
