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
import MetadataInput from 'components/form/widget/MetadataInput';
import useActionRepoContract from 'hooks/contracts/useActionRepoContract';
import useErrors from 'hooks/useErrors';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A dialog for adding an action or updating a specified action.
 */
export default function ActionManageDialog({ action, isClose, onClose }) {
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { addAction, updateActionUri } = useActionRepoContract();
  const [formData, setFormData] = useState(action || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: [...(action ? ['guid'] : []), 'uri'],
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
        },
      }),
      uri: {
        type: 'string',
        title: 'Metadata',
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
      tool: {
        'ui:emptyValue': '',
        'ui:widget': 'hidden',
      },
    },
    uri: {
      'ui:widget': 'MetadataInput',
      'ui:options': {
        subLabel: 'Action name, description, icon',
        fields: {
          name: {
            type: 'string',
            title: 'Name',
          },
          description: {
            type: 'string',
            title: 'Description',
          },
          icon: {
            type: 'string',
            title: 'Icon',
          },
        },
        requiredFields: ['name', 'icon'],
      },
    },
  };

  const widgets = {
    MetadataInput: MetadataInput,
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
      <DialogTitle>{action ? 'Update Action' : 'Add Action'}</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          formData={formData}
          uiSchema={uiSchema}
          widgets={widgets}
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
