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
import JurisdictionMetadata from 'classes/metadata/JurisdictionMetadata';
import ImageInput from 'components/form/widget/ImageInput';
import useHubContract from 'hooks/contracts/useHubContract';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useErrors from 'hooks/useErrors';
import useIpfs from 'hooks/useIpfs';
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
  const { uploadJsonToIPFS } = useIpfs();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);
  const [formData, setFormData] = useState({
    ...(jurisdiction && {
      image: jurisdiction.uriData?.image,
      name: jurisdiction.name,
      description: jurisdiction.uriData?.description,
    }),
  });

  const schema = {
    type: 'object',
    required: ['name'],
    properties: {
      image: {
        type: 'string',
        title: '',
      },
      name: {
        type: 'string',
        title: t('input-name-title'),
      },
      description: {
        type: 'string',
        title: t('input-description-title'),
      },
    },
  };

  const uiSchema = {
    image: {
      'ui:widget': 'ImageInput',
    },
    name: {
      'ui:disabled': jurisdiction ? true : false,
    },
    description: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 3,
      },
    },
  };

  const widgets = {
    ImageInput: ImageInput,
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
      const { url: jurisdictionMetadataUri } = await uploadJsonToIPFS(
        new JurisdictionMetadata(formData.image, formData.description),
      );
      if (jurisdiction) {
        await setUri(jurisdiction?.id, jurisdictionMetadataUri);
        handleSetJurisdictionUri(jurisdiction?.id);
      } else {
        await makeJurisdiction(formData.name, jurisdictionMetadataUri);
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
      <DialogTitle sx={{ pb: 0 }}>
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
