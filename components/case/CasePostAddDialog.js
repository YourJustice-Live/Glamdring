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
import { CASE_ROLE_KEY } from 'constants/i18n';
import { CONFIRMATION_TYPE, POST_TYPE } from 'constants/metadata';
import useDataContext from 'hooks/context/useDataContext';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useCase from 'hooks/useCase';
import useErrors from 'hooks/useErrors';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import {
  handleAddCaseEvidenceEvent,
  handleCommentCaseEvent,
  handleConfirmCaseEvent,
} from 'utils/analytics';

/**
 * A component with dialog for add case post (comment, confirmation).
 */
export default function CasePostAddDialog({
  caseObject,
  postType = POST_TYPE.comment,
  isClose,
  onClose,
}) {
  const { t } = useTranslation('common');
  const { accountProfile } = useDataContext();
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { uploadJsonToIPFS } = useIpfs();
  const { addPost } = useCaseContract();
  const { isProfileHasCaseRole } = useCase();
  const [caseRoleNames, setCaseRoleNames] = useState([]);
  const [caseRoleStrings, setCaseRoleStrings] = useState([]);
  const [formData, setFormData] = useState({});
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
          title: t('input-role-your-title'),
          enum: caseRoleNames,
          enumNames: caseRoleStrings,
          default: caseRoleNames?.[0],
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
          title: t('input-message-title'),
        },
      }),
      // Confirmation type input
      ...(postType === POST_TYPE.confirmation && {
        confirmationType: {
          type: 'string',
          title: t('input-case-confirm-title'),
          enum: [CONFIRMATION_TYPE.confirmation, CONFIRMATION_TYPE.denial],
          enumNames: [
            t('text-confirmation-i-confirm'),
            t('text-confirmation-i-deny'),
          ],
        },
      }),
    },
  };

  const uiSchema = {
    ...(caseRoleNames?.length === 1 && {
      role: {
        'ui:widget': 'hidden',
      },
    }),
    evidencePostUri: {
      'ui:widget': 'CaseEvidencePostInput',
      'ui:options': {
        subLabel: '...',
      },
    },
    message: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
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
      showToastSuccess(t('notification-data-is-successfully-updated'));
      close();
    } catch (error) {
      handleError(error, true);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // Define which roles the profile has
    if (accountProfile && caseObject) {
      const caseRoleNames = Object.values(CASE_ROLE)
        .filter((caseRole) =>
          isProfileHasCaseRole(caseObject, accountProfile.id, caseRole.id),
        )
        .map((caseRole) => caseRole.name);
      const caseRoleStrings = caseRoleNames.map((caseRoleName) =>
        t(CASE_ROLE_KEY[caseRoleName]),
      );
      setCaseRoleNames(caseRoleNames);
      setCaseRoleStrings(caseRoleStrings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountProfile, caseObject]);

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? null : close}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ pb: 0 }}>
        {postType === POST_TYPE.evidence && t('dialog-case-add-evidence-title')}
        {postType === POST_TYPE.comment && t('dialog-case-add-comment-title')}
        {postType === POST_TYPE.confirmation &&
          t('dialog-case-add-confirmation-title')}
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
                {t('text-processing')}
              </LoadingButton>
            ) : (
              <>
                <Button variant="contained" type="submit">
                  {t('button-add')}
                </Button>
                <Button variant="outlined" onClick={onClose}>
                  {t('button-cancel')}
                </Button>
              </>
            )}
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
