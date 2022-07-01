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
import ActionMetadata from 'classes/metadata/ActionMetadata';
import IconSelect from 'components/form/widget/IconSelect';
import useActionRepoContract from 'hooks/contracts/useActionRepoContract';
import useErrors from 'hooks/useErrors';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A dialog for adding an action or updating a specified action.
 *
 * TODO: Move strings to localization file.
 */
export default function ActionManageDialog({ action, isClose, onClose }) {
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { addAction, updateActionUri } = useActionRepoContract();
  const { uploadJsonToIPFS } = useIpfs();
  const [formData, setFormData] = useState({
    ...(action && {
      name: action.uriData.name,
      description: action.uriData.description,
      icon: action.uriData.icon,
    }),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: [...(!action ? ['subject', 'verb'] : []), 'name', 'icon'],
    properties: {
      // Properties only for creating an action
      ...(!action && {
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
      }),
      // Properties for creating or updating an action
      name: {
        type: 'string',
        title: 'Name to display',
      },
      description: {
        type: 'string',
        title: 'Description to display',
      },
      icon: {
        type: 'string',
        title: 'Icon to display',
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
    name: {
      'ui:placeholder': 'Founder breached contract',
    },
    icon: {
      'ui:widget': 'IconSelect',
    },
  };

  const widgets = {
    IconSelect: IconSelect,
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
      const { url: actionMetadataUri } = await uploadJsonToIPFS(
        new ActionMetadata(formData.name, formData.description, formData.icon),
      );
      if (action) {
        await updateActionUri(action.guid, actionMetadataUri);
      } else {
        await addAction(
          {
            subject: formData.subject,
            verb: formData.verb,
            object: formData.object,
            tool: formData.tool,
          },
          actionMetadataUri,
        );
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
      <DialogTitle sx={{ pb: 0 }}>
        {action ? 'Update Action' : 'Add Action'}
      </DialogTitle>
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
