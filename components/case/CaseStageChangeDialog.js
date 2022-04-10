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
import { useState } from 'react';

/**
 * A dialog for change case stage.
 */
export default function CaseStageChangeDialog({
  caseObject,
  isClose,
  onClose,
}) {
  const { showToastSuccess, showToastError } = useToasts();
  const { setStageOpen, setStageVerdict, setStageClosed } = useCaseContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    properties: {
      stage: {
        type: 'string',
        title: 'New Stage',
        default: CASE_STAGE.open,
        enum: [CASE_STAGE.open, CASE_STAGE.verdict, CASE_STAGE.closed],
        enumNames: ['Open', 'Verdict', 'Closed'],
      },
    },
    dependencies: {
      stage: {
        oneOf: [
          {
            properties: {
              stage: {
                enum: [CASE_STAGE.closed],
              },
              verdictUri: {
                type: 'string',
                title: 'Verdict URI',
                default: '',
              },
            },
          },
        ],
      },
    },
  };

  const uiSchema = {
    verdictUri: {
      'ui:emptyValue': '',
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
      if (formData.stage === CASE_STAGE.open) {
        await setStageOpen(caseObject.id);
      }
      if (formData.stage === CASE_STAGE.verdict) {
        await setStageVerdict(caseObject.id);
      }
      if (formData.stage === CASE_STAGE.closed) {
        await setStageClosed(caseObject.id, formData.verdictUri);
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
      <DialogTitle>Change stage</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          uiSchema={uiSchema}
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
                  Change stage
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
