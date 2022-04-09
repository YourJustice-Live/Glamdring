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
import useCaseContract from 'hooks/contracts/useCaseContract';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A dialog for add post to case.
 */
export default function CasePostAddDialog({ caseObject, isClose, onClose }) {
  const { showToastSuccess, showToastError } = useToasts();
  const { addPost } = useCaseContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    properties: {
      entityRole: {
        type: 'string',
        title: 'Entity Role',
        default: '',
      },
      postRole: {
        type: 'string',
        title: 'Post Role',
        default: '',
      },
      uri: {
        type: 'string',
        title: 'URI',
        default: '',
      },
    },
  };

  const uiSchema = {
    entityRole: {
      'ui:emptyValue': '',
      'ui:placeholder': 'subject',
    },
    postRole: {
      'ui:emptyValue': '',
      'ui:placeholder': 'evidence',
    },
    uri: {
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
      console.log('[Dev] formData', formData);
      setFormData(formData);
      setIsLoading(true);
      await addPost(
        caseObject.id,
        formData.entityRole,
        formData.postRole,
        formData.uri,
      );
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onClose={isLoading ? null : close}>
      <DialogTitle>Add Post</DialogTitle>
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
                  Add Post
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
