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
import DataUriInput from 'components/form/widget/DataUriInput';
import useActionRepoContract from 'hooks/contracts/useActionRepoContract';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A dialog for adding an action or updating a specified action.
 */
export default function ActionManageDialog({ action, isClose, onClose }) {
  const { showToastSuccess, showToastError } = useToasts();
  const { addAction, updateActionUri } = useActionRepoContract();
  const [formData, setFormData] = useState(action || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    properties: {
      // Show guid scheme only for updating a guid
      ...(action && {
        guid: {
          type: 'string',
          title: 'GUID (ID)',
        },
      }),
      // Show action scheme only for adding a action
      ...(!action && {
        action: {
          type: 'object',
          title: 'Action',
          properties: {
            subject: {
              type: 'string',
              title: 'Subject',
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
        },
      }),
      uri: {
        type: 'string',
        title: 'Additional Data',
        default: '',
      },
    },
  };

  const uiSchema = {
    guid: {
      'ui:disabled': true,
    },
    action: {
      subject: {
        'ui:emptyValue': '',
        'ui:placeholder': 'founder',
      },
      verb: {
        'ui:emptyValue': '',
        'ui:placeholder': 'breach',
      },
      object: {
        'ui:emptyValue': '',
        'ui:placeholder': 'contract',
      },
      tool: { 'ui:emptyValue': '' },
    },
    uri: {
      'ui:emptyValue': '',
      'ui:widget': 'DataUriInput',
    },
  };

  const widgets = {
    DataUriInput: DataUriInput,
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
      if (action) {
        await updateActionUri(formData.guid, formData.uri);
      } else {
        await addAction(formData.action, formData.uri);
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
      <DialogTitle>{action ? 'Update Action' : 'Add Action'}</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          formData={formData}
          uiSchema={uiSchema}
          widgets={widgets}
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
                  {action ? 'Update Action' : 'Add Action'}
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
