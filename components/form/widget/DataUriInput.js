import { Divider, Paper, Typography } from '@mui/material';
import FormDialog from 'components/form/FormDialog';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A widget for entering any data, publishing it to IPFS and getting a URI.
 */
export default function DataUriInput(props) {
  const propsLabel = props.label;
  const propsValue = props.value; // Data URI
  const propsOnChange = props.onChange;

  const { showToastError } = useToasts();
  const { loadJsonFromIPFS, uploadJsonToIPFS } = useIpfs();

  const [formData, setFormData] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Default form schema.
   *
   * TODO: Use additional properties for generate complex schema (https://rjsf-team.github.io/react-jsonschema-form/).
   */
  const formSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Name',
      },
      description: {
        type: 'string',
        title: 'Description',
      },
    },
  };

  /**
   * Initiate the form data by loading data from the props uri.
   */
  async function initFormData() {
    try {
      setIsLoading(true);
      if (propsValue) {
        setFormData(await loadJsonFromIPFS(propsValue));
      }
    } catch (error) {
      showToastError(error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Open the form to entering data.
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
      showToastError(error);
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
      <Typography variant="h5">{propsLabel}</Typography>
      <Divider sx={{ mb: 2 }} />
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </Paper>
          <FormDialog
            buttonTitle="Edit data"
            formTitle="Edit data"
            formSchema={formSchema}
            formData={formData}
            isLoading={isLoading}
            isOpen={isFormOpen}
            onOpen={openForm}
            onClose={closeForm}
            onSubmit={submitForm}
          />
        </>
      )}
    </>
  );
}
