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
import NominateMetadata from 'classes/metadata/NominateMetadata';
import ProfileSelect from 'components/form/widget/ProfileSelect';
import { CASE_ROLE } from 'constants/contracts';
import { CASE_ROLE_KEY } from 'constants/i18n';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useErrors from 'hooks/useErrors';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { handleNominateToCaseEvent } from 'utils/analytics';

/**
 * A component with dialog for add a case nominate with a specified role.
 */
export default function CaseNominateAddDialog({
  caseObject,
  nominateRoleId = CASE_ROLE.witness.id,
  isClose,
  onClose,
}) {
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { uploadJsonToIPFS } = useIpfs();
  const { nominate } = useCaseContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['profileId', 'comment'],
    properties: {
      profileId: {
        type: 'string',
        title: t(CASE_ROLE_KEY[nominateRoleId]),
      },
      comment: {
        type: 'string',
        title: `${t('input-case-nominate-comment-title-1')} ${t(
          CASE_ROLE_KEY[nominateRoleId],
        ).toLowerCase()} ${t('input-case-nominate-comment-title-2')}`,
      },
    },
  };

  const uiSchema = {
    profileId: {
      'ui:widget': 'ProfileSelect',
    },
    comment: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
      },
    },
  };

  const widgets = {
    ProfileSelect: ProfileSelect,
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
      const { url } = await uploadJsonToIPFS(
        new NominateMetadata(nominateRoleId, formData.comment),
      );
      await nominate(caseObject.id, formData.profileId, url);
      handleNominateToCaseEvent(
        caseObject.id,
        formData.profileId,
        nominateRoleId,
      );
      showToastSuccess(t('notification-data-is-successfully-updated'));
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
      <DialogTitle sx={{ pb: 0 }}>
        {t('dialog-case-nominate-title')}{' '}
        {t(CASE_ROLE_KEY[nominateRoleId]).toLowerCase()}
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
                  {t('button-case-nominate')}
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
