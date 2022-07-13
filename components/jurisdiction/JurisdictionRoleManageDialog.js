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
import { JURISDICTION_ROLE } from 'constants/contracts';
import { JURISDICTION_ROLE_KEY } from 'constants/i18n';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useErrors from 'hooks/useErrors';
import useToasts from 'hooks/useToasts';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

/**
 * A dialog for assign or remove jurisdiction role for a specified profile.
 */
export default function RoleManageDialog({
  jurisdiction,
  isAssign,
  isClose,
  onClose,
}) {
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { assignRole, removeRole } = useJuridictionContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['profileId', 'role'],
    properties: {
      profileId: {
        type: 'string',
        title: '',
      },
      role: {
        type: 'string',
        title: t('input-role-title'),
        default: JURISDICTION_ROLE.member.name,
        enum: [
          JURISDICTION_ROLE.member.name,
          JURISDICTION_ROLE.judge.name,
          JURISDICTION_ROLE.admin.name,
        ],
        enumNames: [
          t(JURISDICTION_ROLE_KEY[JURISDICTION_ROLE.member.name]),
          t(JURISDICTION_ROLE_KEY[JURISDICTION_ROLE.judge.name]),
          t(JURISDICTION_ROLE_KEY[JURISDICTION_ROLE.admin.name]),
        ],
      },
    },
  };

  const uiSchema = {
    profileId: {
      'ui:widget': 'ProfileSelect',
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
      if (isAssign) {
        await assignRole(jurisdiction?.id, formData.profileId, formData.role);
      } else {
        await removeRole(jurisdiction?.id, formData.profileId, formData.role);
      }
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
      onClose={isLoading ? null : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        {isAssign
          ? t('dialog-jurisdiction-assign-role-title')
          : t('dialog-jurisdiction-remove-role-title')}
      </DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          widgets={widgets}
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
                {t('text-processing')}
              </LoadingButton>
            ) : (
              <>
                <Button variant="contained" type="submit">
                  {isAssign
                    ? t('button-jurisdiction-assign-role')
                    : t('button-jurisdiction-remove-role')}
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
