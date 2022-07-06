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
import useCaseContract from 'hooks/contracts/useCaseContract';
import useErrors from 'hooks/useErrors';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { handleAddCaseWitnessEvent } from 'utils/analytics';

/**
 * A component with dialog for add case witness.
 */
export default function CaseWitnessAddDialog({ caseObject, isClose, onClose }) {
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { assignRole } = useCaseContract();
  const { getProfile } = useProfile();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['witnessProfileId'],
    properties: {
      witnessProfileId: {
        type: 'string',
        title: '',
      },
    },
  };

  const uiSchema = {
    witnessProfileId: {
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
      const witnessProfile = await getProfile({
        id: formData.witnessProfileId,
      });
      await assignRole(
        caseObject.id,
        witnessProfile.owner,
        CASE_ROLE.witness.name,
      );
      handleAddCaseWitnessEvent(caseObject.id);
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
        {t('dialog-case-add-witness-title')}
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
