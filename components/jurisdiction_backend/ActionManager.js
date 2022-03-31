import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import useActionRepoContract from 'hooks/useActionRepoContract';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A component with a button and dialog for manage actions.
 */
export default function ActionManager() {
  const { showToastSuccess, showToastError } = useToasts();
  const { addAction } = useActionRepoContract();
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = {
    type: 'object',
    properties: {
      action: {
        type: 'object',
        title: 'Action',
        properties: {
          subject: {
            type: 'string',
            title: 'Subject',
            default: 'founder',
          },
          verb: {
            type: 'string',
            title: 'Verb',
            default: 'breach',
          },
          object: {
            type: 'string',
            title: 'Object',
            default: 'contract',
          },
          tool: {
            type: 'string',
            title: 'Tool',
            default: '',
          },
          affected: {
            type: 'string',
            title: 'Affected',
            default: 'investor',
          },
        },
      },
      confirmation: {
        type: 'object',
        title: 'Confirmation',
        properties: {
          ruling: {
            type: 'string',
            title: 'Ruling',
            default: 'judge',
          },
          evidence: {
            type: 'boolean',
            title: 'Evidence',
            default: true,
          },
          witness: {
            type: 'integer',
            title: 'Witness',
            default: 1,
          },
        },
      },
      uri: {
        type: 'string',
        title: 'URI',
        default: 'TEST_URI',
      },
    },
  };

  const uiSchema = {
    action: {
      subject: { 'ui:emptyValue': '' },
      verb: { 'ui:emptyValue': '' },
      object: { 'ui:emptyValue': '' },
      tool: { 'ui:emptyValue': '' },
      affected: { 'ui:emptyValue': '' },
    },
    confirmation: {
      ruling: { 'ui:emptyValue': '' },
      witness: { 'ui:widget': 'updown' },
    },
    uri: { 'ui:emptyValue': '' },
  };

  function open() {
    setIsOpen(true);
  }

  function close() {
    setFormData({});
    setIsLoading(null);
    setIsOpen(false);
  }

  async function submit({ formData }) {
    try {
      // Update states
      setFormData(formData);
      setIsLoading(true);
      // Use contract
      await addAction(formData.action, formData.confirmation, formData.uri);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={open}>
        Manage Actions
      </Button>
      <Dialog open={isOpen} onClose={isLoading ? null : close}>
        <DialogTitle>Action Manager</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a new action.</DialogContentText>
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
                    Submit
                  </Button>
                  <Button variant="outlined" onClick={close}>
                    Cancel
                  </Button>
                </>
              )}
            </Stack>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
