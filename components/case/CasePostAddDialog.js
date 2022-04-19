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
import WitnessPostMetadata from 'classes/metadata/WitnessPostMetadata';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A component with dialog for add case post.
 *
 * @param {{caseObject: object, entityRole: 'witness', postType: 'witness', isClose: function, onClose: function}} params Params.
 */
export default function CasePostAddDialog({
  caseObject,
  entityRole,
  postType,
  isClose,
  onClose,
}) {
  const { showToastSuccess, showToastError } = useToasts();
  const { uploadJsonToIPFS } = useIpfs();
  const { addPost } = useCaseContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['message'],
    properties: {
      message: {
        type: 'string',
        title: 'Message',
      },
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
      // Define post metadata
      let postMetadata;
      if (postType === 'witness') {
        postMetadata = new WitnessPostMetadata(formData.message);
      } else {
        throw new Error('Post type is not supported');
      }
      // Upload post metadata to ipfs and add post to contract
      const { url: postMetadataUri } = await uploadJsonToIPFS(postMetadata);
      await addPost(caseObject.id, entityRole, postMetadataUri);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? null : close}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        {postType === 'witness' ? 'Add Witness Post' : 'Add Post'}
      </DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
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
                  {postType === 'witness' ? 'Add Witness Post' : 'Add Post'}
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
