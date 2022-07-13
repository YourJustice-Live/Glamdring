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
import ProfileSelect from 'components/form/widget/ProfileSelect';
import { CASE_ROLE } from 'constants/contracts';
import { CASE_ROLE_KEY } from 'constants/i18n';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useErrors from 'hooks/useErrors';
import useToasts from 'hooks/useToasts';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

/**
 * A component with dialog for assign a case role.
 */
export default function CaseRoleAssignDialog({
  caseObject,
  profileId,
  roleName,
  isClose,
  onClose,
}) {
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { assignRoleToToken } = useCaseContract();
  const [formData, setFormData] = useState({
    ...(profileId && { profileId: profileId }),
    ...(roleName && { roleName: roleName }),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['profileId', 'roleName'],
    properties: {
      profileId: {
        type: 'string',
        title: t('text-profile'),
      },
      roleName: {
        type: 'string',
        title: t('input-role-title'),
        default: CASE_ROLE.witness.name,
        enum: [CASE_ROLE.witness.name],
        enumNames: [t(CASE_ROLE_KEY[CASE_ROLE.witness.id])],
      },
    },
  };

  const uiSchema = {
    profileId: {
      'ui:widget': 'ProfileSelect',
      'ui:disabled': profileId,
    },
    roleName: {
      'ui:disabled': roleName,
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
      await assignRoleToToken(
        caseObject.id,
        formData.profileId,
        formData.roleName,
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
        {t('dialog-case-assign-role-title')}
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
                  {t('button-assign')}
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
