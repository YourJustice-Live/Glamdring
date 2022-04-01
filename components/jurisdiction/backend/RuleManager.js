import { useState } from 'react';
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
import useJuridictionContract from 'hooks/useJurisdictionContract';
import useToasts from 'hooks/useToasts';

/**
 * A component with a button and dialog for manage jurisdiction rules.
 */
export default function RuleManager() {
  const { showToastSuccess, showToastError } = useToasts();
  const { addRule } = useJuridictionContract();
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = {
    type: 'object',
    required: ['about'],
    properties: {
      about: {
        type: 'string',
        title: 'About (Action GUID)',
      },
      uri: {
        type: 'string',
        title: 'URI',
        default: 'TEST_URI',
      },
      effects: {
        type: 'object',
        properties: {
          professional: {
            type: 'integer',
            title: 'Professional',
            default: -5,
          },
          social: {
            type: 'integer',
            title: 'Social',
            default: 5,
          },
          personal: {
            type: 'integer',
            title: 'Personal',
            default: 0,
          },
        },
      },
      negation: {
        type: 'boolean',
        title: 'Negation',
        default: false,
      },
    },
  };

  const uiSchema = {
    uri: { 'ui:emptyValue': '' },
    effects: {
      professional: { 'ui:widget': 'updown' },
      social: { 'ui:widget': 'updown' },
      personal: { 'ui:widget': 'updown' },
    },
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
      await addRule(formData);
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
        Manage Rules
      </Button>
      <Dialog open={isOpen} onClose={isLoading ? null : close}>
        <DialogTitle>Rule Manager</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a new rule.</DialogContentText>
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
