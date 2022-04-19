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
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';
import CommentPostMetadata from 'classes/metadata/CommentPostMetadata';
import { CASE_ROLE } from 'constants/contracts';
import { capitalize } from 'lodash';

/**
 * A component with dialog for add case comment post.
 */
export default function CaseCommentPostAddDialog({
  caseObject,
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
    required: ['role', 'message'],
    properties: {
      role: {
        type: 'string',
        title: 'Your Role',
        enum: [
          CASE_ROLE.admin.name,
          CASE_ROLE.subject.name,
          CASE_ROLE.plaintiff.name,
          CASE_ROLE.judge.name,
          CASE_ROLE.witness.name,
          CASE_ROLE.affected.name,
        ],
        enumNames: [
          capitalize(CASE_ROLE.admin.name),
          capitalize(CASE_ROLE.subject.name),
          capitalize(CASE_ROLE.plaintiff.name),
          capitalize(CASE_ROLE.judge.name),
          capitalize(CASE_ROLE.witness.name),
          capitalize(CASE_ROLE.affected.name),
        ],
      },
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
      const { url: commentPostMetadataUri } = await uploadJsonToIPFS(
        new CommentPostMetadata(formData.message),
      );
      await addPost(caseObject.id, formData.role, commentPostMetadataUri);
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
      <DialogTitle>Add Comment Post</DialogTitle>
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
                  Add Comment Post
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
