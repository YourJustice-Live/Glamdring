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
import useHubContract from 'hooks/contracts/useHubContract';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A dialog for adding a jurisdiction or updating a specified jurisdiction.
 */
export default function JurisdictionManageDialog({
  jurisdiction,
  isClose,
  onClose,
}) {
  const { showToastSuccess, showToastError } = useToasts();
  const { makeJurisdiction } = useHubContract();
  const { setUri } = useJuridictionContract();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);
  const [formData, setFormData] = useState(jurisdiction || {});

  const schema = {
    type: 'object',
    required: ['name'],
    properties: {
      // Show id scheme only for updating a jurisdiction
      ...(jurisdiction && {
        id: {
          type: 'string',
          title: 'ID (Address)',
        },
      }),
      name: {
        type: 'string',
        title: 'Name',
        default: '',
      },
      uri: {
        type: 'string',
        title: 'Metadata',
        default: '',
      },
    },
  };

  const uiSchema = {
    id: {
      'ui:disabled': true,
    },
    name: {
      'ui:disabled': jurisdiction ? true : false,
    },
    uri: {
      'ui:emptyValue': '',
      'ui:widget': 'MetadataInput',
      'ui:options': {
        subLabel: 'Jurisdiction image and description',
        fields: {
          image: {
            type: 'string',
            title: '',
          },
          description: {
            type: 'string',
            title: 'Description',
          },
        },
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
      if (jurisdiction) {
        await setUri(jurisdiction?.id, formData.uri);
      } else {
        await makeJurisdiction(formData.name, formData.uri);
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
      <DialogTitle>
        {jurisdiction ? 'Update Jurisdiction' : 'Create Jurisdiction'}
      </DialogTitle>
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
                  {jurisdiction ? 'Update Jurisdiction' : 'Create Jurisdiction'}
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