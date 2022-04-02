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
import useActionRepoContract from 'hooks/useActionRepoContract';
import useSubgraph from 'hooks/useSubgraph';
import useToasts from 'hooks/useToasts';

/**
 * A component with a list of actions and forms for adding or updating an action.
 */
export default function ActionsManager() {
  const { showToastError } = useToasts();
  const { findActionEntities } = useSubgraph();

  const [actions, setActions] = useState(null);

  async function loadActions() {
    try {
      setActions(await findActionEntities());
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
            {actions.map((rule, index) => (
              <Grid key={index} item xs={12}>
                <Card elevation={3} sx={{ p: 1 }}>
                  <CardContent>
                    <pre>{JSON.stringify(rule, null, 2)}</pre>
                    <Stack direction="row" spacing={2}>
                      <UpdateActionUriFormDialog />
                      <UpdateActionConfirmationFormDialog />
                    </Stack>
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
          affected: {
            type: 'string',
            title: 'Affected',
            default: 'investor',
          },
        },
      },
      confirmation: {
        type: 'object',
        title: 'Confirmation',
        properties: {
          ruling: {
            type: 'string',
            title: 'Ruling',
            default: 'judge',
          },
          evidence: {
            type: 'boolean',
            title: 'Evidence',
            default: true,
          },
          witness: {
            type: 'integer',
            title: 'Witness',
            default: 1,
          },
        },
      },
      uri: {
        type: 'string',
        title: 'URI',
        default: 'TEST_URI',
      },
    },
  };

  const uiSchema = {
    action: {
      subject: { 'ui:emptyValue': '' },
      verb: { 'ui:emptyValue': '' },
      object: { 'ui:emptyValue': '' },
      tool: { 'ui:emptyValue': '' },
      affected: { 'ui:emptyValue': '' },
    },
    confirmation: {
      ruling: { 'ui:emptyValue': '' },
      witness: { 'ui:widget': 'updown' },
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
      await addAction(formData.action, formData.confirmation, formData.uri);
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
      formText="Add a action."
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
 * TODO: Implement this component
 */
function UpdateActionUriFormDialog() {
  return (
    <Button variant="outlined" onClick={() => console.error('Not implemented')}>
      Update URI
    </Button>
  );
}

/**
 * TODO: Implement this component
 */
function UpdateActionConfirmationFormDialog() {
  return (
    <Button variant="outlined" onClick={() => console.error('Not implemented')}>
      Update Confirmation
    </Button>
  );
}
