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
import CommentPostMetadata from 'classes/metadata/CommentPostMetadata';
import ConfirmationPostMetadata from 'classes/metadata/ConfirmationPostMetadata';
import CaseEvidencePostInput from 'components/form/widget/CaseEvidencePostInput';
import { CASE_ROLE } from 'constants/contracts';
import { CONFIRMATION_TYPE, POST_TYPE } from 'constants/metadata';
import { CASE_ROLE_STRING } from 'constants/strings';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useErrors from 'hooks/useErrors';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';
import {
  handleAddCaseEvidenceEvent,
  handleCommentCaseEvent,
  handleConfirmCaseEvent,
} from 'utils/analytics';

/**
 * A component with dialog for add case post (comment, confirmation).
 *
 * TODO: Automatically define account roles
 */
export default function CasePostAddDialog({
  caseObject,
  postType = POST_TYPE.comment,
  isClose,
  onClose,
}) {
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { uploadJsonToIPFS } = useIpfs();
  const [formData, setFormData] = useState({});
  const { addPost } = useCaseContract();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    ...(postType === POST_TYPE.evidence && {
      required: ['role', 'evidencePostUri'],
    }),
    ...(postType === POST_TYPE.comment && {
      required: ['role', 'message'],
    }),
    ...(postType === POST_TYPE.confirmation && {
      required: ['confirmationType'],
    }),
    properties: {
      // Role input
      ...((postType === POST_TYPE.evidence ||
        postType === POST_TYPE.comment) && {
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
            CASE_ROLE_STRING.admin,
            CASE_ROLE_STRING.subject,
            CASE_ROLE_STRING.plaintiff,
            CASE_ROLE_STRING.judge,
            CASE_ROLE_STRING.witness,
            CASE_ROLE_STRING.affected,
          ],
        },
      }),
      // Evidence input
      ...(postType === POST_TYPE.evidence && {
        evidencePostUri: {
          type: 'string',
          title: '',
        },
      }),
      // Message input
      ...((postType === POST_TYPE.comment ||
        postType === POST_TYPE.confirmation) && {
        message: {
          type: 'string',
          title: 'Message',
        },
      }),
      // Confirmation type input
      ...(postType === POST_TYPE.confirmation && {
        confirmationType: {
          type: 'string',
          title: 'Do you confirm this case?',
          enum: [CONFIRMATION_TYPE.confirmation, CONFIRMATION_TYPE.denial],
          enumNames: ['Yes, I confirm', 'No, I deny'],
        },
      }),
    },
  };

  const uiSchema = {
    evidencePostUri: {
      'ui:widget': 'CaseEvidencePostInput',
      'ui:options': {
        subLabel: '...',
      },
    },
  };

  const widgets = {
    CaseEvidencePostInput: CaseEvidencePostInput,
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
      // If post is evidence
      if (postType === POST_TYPE.evidence) {
        await addPost(caseObject.id, formData.role, formData.evidencePostUri);
        handleAddCaseEvidenceEvent(caseObject.id);
      }
      // If post is comment
      if (postType === POST_TYPE.comment) {
        const { url } = await uploadJsonToIPFS(
          new CommentPostMetadata(formData.message),
        );
        await addPost(caseObject.id, formData.role, url);
        handleCommentCaseEvent(caseObject.id);
      }
      // If post is confirmation
      if (postType === POST_TYPE.confirmation) {
        const { url } = await uploadJsonToIPFS(
          new ConfirmationPostMetadata(
            formData.confirmationType,
            formData.message,
          ),
        );
        await addPost(caseObject.id, CASE_ROLE.witness.name, url);
        handleConfirmCaseEvent(caseObject.id);
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
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        {postType === POST_TYPE.evidence && 'Add Evidence'}
        {postType === POST_TYPE.comment && 'Add Comment'}
        {postType === POST_TYPE.confirmation && 'Add Confirmation'}
      </DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          widgets={widgets}
          formData={formData}
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
