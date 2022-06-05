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
import useErrors from 'hooks/useErrors';
import useToasts from 'hooks/useToasts';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import {
  handleMakeJurisdiction,
  handleSetJurisdictionUri,
} from 'utils/analytics';

/**
 * A dialog for adding a jurisdiction or updating a specified jurisdiction.
 */
export default function JurisdictionManageDialog({
  jurisdiction,
  isClose,
  onClose,
}) {
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
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
          title: t('input-jurisdiction-id-title'),
        },
      }),
      name: {
        type: 'string',
        title: t('input-name-title'),
        default: '',
      },
      uri: {
        type: 'string',
        title: t('input-jurisdiction-metadata-title'),
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
        subLabel: t('input-jurisdiction-metadata-description'),
        fields: {
          image: {
            type: 'string',
            title: '',
          },
          description: {
            type: 'string',
            title: t('input-description-title'),
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
        handleSetJurisdictionUri(jurisdiction?.id);
      } else {
        await makeJurisdiction(formData.name, formData.uri);
        handleMakeJurisdiction();
      }
      showToastSuccess(t('notification-data-is-successfully-updated'));
      close();
    } catch (error) {
      handleError(error, true);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onClose={isLoading ? null : close}>
      <DialogTitle>
        {jurisdiction
          ? t('dialog-jurisdiction-update-title')
          : t('dialog-jurisdiction-create-title')}
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
                {t('text-processing')}
              </LoadingButton>
            ) : (
              <>
                <Button variant="contained" type="submit">
                  {jurisdiction
                    ? t('button-jurisdiction-update')
                    : t('button-jurisdiction-create')}
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
