import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import useErrors from 'hooks/useErrors';
import useIpfs from 'hooks/useIpfs';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import ImageInput from './ImageInput';
import MetadataIconSelect from './MetadataIconSelect';

/**
 * A widget for entering metadata, publishing it to IPFS and getting a URI.
 */
export default function MetadataInput(props) {
  const propsLabel = props.label;
  const propsSubLabel = props.options?.subLabel;
  const propsValue = props.value; // Metadata URI
  const propsRequired = props.required;
  const propsFields = props.options?.fields || [];
  const propsRequiredFields = props.options?.requiredFields || [];
  const propsOnChange = props.onChange;

  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { loadJsonFromIPFS, uploadJsonToIPFS } = useIpfs();

  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({});

  /**
   * Default form schema.
   */
  const formSchema = {
    type: 'object',
    required: [...propsRequiredFields],
    properties: {
      ...propsFields,
    },
  };

  const formUiSchema = {
    image: {
      'ui:widget': 'ImageInput',
    },
    icon: {
      'ui:widget': 'MetadataIconSelect',
    },
  };

  const widgets = {
    ImageInput: ImageInput,
    MetadataIconSelect: MetadataIconSelect,
  };

  /**
   * Initiate the form data by loading metadata from the props uri.
   */
  async function initFormData() {
    try {
      setIsLoading(true);
      if (propsValue) {
        setFormData(await loadJsonFromIPFS(propsValue));
      }
    } catch (error) {
      handleError(error, true);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Open the form to entering metadata.
   */
  async function openForm() {
    setIsFormOpen(true);
  }

  /**
   * Close the form.
   */
  async function closeForm() {
    setIsFormOpen(false);
  }

  /**
   * Upload a form data to IPFS and return received URL (URI).
   */
  async function submitForm({ formData }) {
    try {
      setIsLoading(true);
      closeForm();
      setFormData(formData);
      const { url } = await uploadJsonToIPFS(formData);
      propsOnChange(url);
    } catch (error) {
      handleError(error, true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    initFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {propsLabel}
        {propsRequired && ' *'}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {propsSubLabel}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {isLoading ? (
        <Typography>{t('text-loading')}...</Typography>
      ) : (
        <>
          <Paper variant="outlined" sx={{ p: 2, mb: 2, overflowX: 'scroll' }}>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </Paper>
          {/* Button for open dialog with form */}
          <Button variant="outlined" onClick={openForm}>
            {t('button-metadata-edit')}
          </Button>
          {/* Dialog with form */}
          <Dialog open={isFormOpen} onClose={closeForm} maxWidth="xs" fullWidth>
            <DialogTitle>{propsLabel}</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>{propsSubLabel}</Typography>
              <Divider sx={{ mb: 0 }} />
              <Form
                schema={formSchema}
                uiSchema={formUiSchema}
                widgets={widgets}
                formData={formData}
                onSubmit={submitForm}
                showErrorList={false}
              >
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button variant="contained" type="submit">
                    {t('button-metadata-edit')}
                  </Button>
                  <Button variant="outlined" onClick={closeForm}>
                    {t('button-cancel')}
                  </Button>
                </Stack>
              </Form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
