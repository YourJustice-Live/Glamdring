import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import FormDialog from 'components/extra/FormDialog';
import useActionRepoContract from 'hooks/contracts/useActionRepoContract';
import useToasts from 'hooks/useToasts';
import useAction from 'hooks/useAction';

/**
 * A component with a list of actions and forms for adding or updating an action.
 */
export default function JurisdictionActionsManager() {
  const { showToastError } = useToasts();
  const { getActions } = useAction();

  const [actions, setActions] = useState(null);

  async function loadActions() {
    try {
      setActions(await getActions());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Actions
      </Typography>
      <Divider sx={{ mb: 2.5 }} />
      <Stack direction="row" spacing={2}>
        <AddActionFormDialog />
        <Button
          variant="outlined"
          onClick={() => {
            setActions(null);
            loadActions();
          }}
        >
          Reload data
        </Button>
      </Stack>
      <Box sx={{ mt: 2.5 }}>
        {actions ? (
          <Grid container spacing={3}>
            {actions.map((action, index) => (
              <Grid key={index} item xs={12}>
                <Card elevation={3} sx={{ p: 1 }}>
                  <CardContent>
                    <pre>{JSON.stringify(action, null, 2)}</pre>
                    <UpdateActionUriFormDialog action={action} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Skeleton
              variant="rectangular"
              sx={{ mb: 1 }}
              width={196}
              height={24}
            />
            <Skeleton variant="rectangular" width={82} height={24} />
          </>
        )}
      </Box>
    </Box>
  );
}

/**
 * A form for adding an action.
 */
function AddActionFormDialog() {
  const { showToastSuccess, showToastError } = useToasts();
  const { addAction } = useActionRepoContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const schema = {
    type: 'object',
    properties: {
      action: {
        type: 'object',
        title: 'Action',
        properties: {
          subject: {
            type: 'string',
            title: 'Subject',
            default: 'founder',
          },
          verb: {
            type: 'string',
            title: 'Verb',
            default: 'breach',
          },
          object: {
            type: 'string',
            title: 'Object',
            default: 'contract',
          },
          tool: {
            type: 'string',
            title: 'Tool',
            default: '',
          },
        },
      },
      uri: {
        type: 'string',
        title: 'URI',
        default:
          'https://ipfs.io/ipfs/QmZHrDqprEnBcs5cUbtYEbFvZRa7D7xeuXNkfjmyC8ZVbE',
      },
    },
  };

  const uiSchema = {
    action: {
      subject: { 'ui:emptyValue': '' },
      verb: { 'ui:emptyValue': '' },
      object: { 'ui:emptyValue': '' },
      tool: { 'ui:emptyValue': '' },
    },
    uri: { 'ui:emptyValue': '' },
  };

  async function open() {
    setIsOpen(true);
  }

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      await addAction(formData.action, formData.uri);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <FormDialog
      buttonTitle="Add Action"
      formTitle="Add Action"
      formSchema={schema}
      formUiSchema={uiSchema}
      formData={formData}
      isLoading={isLoading}
      isOpen={isOpen}
      onOpen={open}
      onClose={close}
      onSubmit={submit}
    />
  );
}

/**
 * A form for updating uri for specified action.
 */
function UpdateActionUriFormDialog({ action }) {
  const { showToastSuccess, showToastError } = useToasts();
  const { updateActionUri } = useActionRepoContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function open() {
    setIsOpen(true);
    setFormData(action);
  }

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      await updateActionUri(formData.guid, formData.uri);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  const schema = {
    type: 'object',
    properties: {
      guid: {
        type: 'string',
        title: 'GUID (ID)',
      },
      uri: {
        type: 'string',
        title: 'URI',
      },
    },
  };

  const uiSchema = {
    giud: { 'ui:emptyValue': '' },
    uri: { 'ui:emptyValue': '' },
  };

  return (
    <FormDialog
      buttonTitle="Update Action URI"
      formTitle="Update Action URI"
      formSchema={schema}
      formUiSchema={uiSchema}
      formData={formData}
      isLoading={isLoading}
      isOpen={isOpen}
      onOpen={open}
      onClose={close}
      onSubmit={submit}
    />
  );
}
