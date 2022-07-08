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
import useActionRepoContract from 'hooks/contracts/useActionRepoContract';
import useErrors from 'hooks/useErrors';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A dialog for adding an action.
 *
 * TODO: Move strings to localization file.
 */
export default function ActionAddDialog({ isClose, onClose }) {
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { addAction } = useActionRepoContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['subject', 'verb'],
    properties: {
      subject: {
        type: 'string',
        title: 'Acted',
        default: '',
      },
      verb: {
        type: 'string',
        title: 'Verb',
        default: '',
      },
      object: {
        type: 'string',
        title: 'Object',
        default: '',
      },
      tool: {
        type: 'string',
        title: 'Tool',
        default: '',
      },
    },
  };

  const uiSchema = {
    subject: {
      'ui:emptyValue': '',
      'ui:placeholder': 'founder',
    },
    verb: {
      'ui:emptyValue': '',
      'ui:placeholder': 'breached',
    },
    object: {
      'ui:emptyValue': '',
      'ui:placeholder': 'contract',
    },
    tool: {
      'ui:emptyValue': '',
      'ui:widget': 'hidden',
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
      await addAction(
        {
          subject: formData.subject,
          verb: formData.verb,
          object: formData.object,
          tool: formData.tool,
        },
        '',
      );
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
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ pb: 0 }}>Add Action</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          formData={formData}
          uiSchema={uiSchema}
          onSubmit={submit}
          disabled={isLoading}
          showErrorList={false}
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
                  Add
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
