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
import { CASE_STAGE } from 'constants/contracts';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useToasts from 'hooks/useToasts';
import { capitalize } from 'lodash';
import { useState } from 'react';

/**
 * A dialog for change case stage.
 */
export default function CaseStageChangeDialog({ isClose, onClose }) {
  const { showToastSuccess, showToastError } = useToasts();
  const { setStageOpen, setStageVerdict } = useCaseContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['contractAddress', 'stage'],
    properties: {
      contractAddress: {
        type: 'string',
        title: 'Contract Address',
      },
      stage: {
        type: 'number',
        title: 'New Stage',
        default: CASE_STAGE.open.id,
        enum: [CASE_STAGE.open.id, CASE_STAGE.verdict.id],
        enumNames: [
          capitalize(CASE_STAGE.open.name),
          capitalize(CASE_STAGE.verdict.name),
        ],
      },
    },
  };

  const uiSchema = {
    contractAddress: {
      'ui:placeholder': '0xfd3...',
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
      if (formData.stage === CASE_STAGE.open.id) {
        await setStageOpen(formData.contractAddress);
      }
      if (formData.stage === CASE_STAGE.verdict.id) {
        await setStageVerdict(formData.contractAddress);
      }
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onClose={isLoading ? null : close}>
      <DialogTitle>Change Case Stage</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          formData={formData}
          uiSchema={uiSchema}
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
                  Change Stage
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
