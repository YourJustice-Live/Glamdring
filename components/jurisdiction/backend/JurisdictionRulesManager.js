import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import FormDialog from 'components/extra/FormDialog';
import useJuridictionContract from 'hooks/useJurisdictionContract';
import useSubgraph from 'hooks/useSubgraph';
import useToasts from 'hooks/useToasts';

/**
 * A component with a list of rules and forms for adding or updating a rule.
 */
export default function JurisdictionRulesManager() {
  const { showToastError } = useToasts();
  const { findJurisdictionRuleEntities } = useSubgraph();
  const [rules, setRules] = useState(null);

  async function loadRules() {
    try {
      setRules(await findJurisdictionRuleEntities());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Rules
      </Typography>
      <Divider sx={{ mb: 2.5 }} />
      <Stack direction="row" spacing={2}>
        <AddRuleFormDialog />
        <Button
          variant="outlined"
          onClick={() => {
            setRules(null);
            loadRules();
          }}
        >
          Reload data
        </Button>
      </Stack>
      <Box sx={{ mt: 2.5 }}>
        {rules ? (
          <Grid container spacing={3}>
            {rules.map((rule, index) => (
              <Grid key={index} item xs={12}>
                <Card elevation={3} sx={{ p: 1 }}>
                  <CardContent>
                    <pre>{JSON.stringify(rule, null, 2)}</pre>
                    <Stack direction="row" spacing={2}>
                      <UpdateRuleFormDialog />
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
 * A form for adding a rule.
 */
function AddRuleFormDialog() {
  const { showToastSuccess, showToastError } = useToasts();
  const { addRule } = useJuridictionContract();
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = {
    type: 'object',
    required: ['about'],
    properties: {
      about: {
        type: 'string',
        title: 'About (Action GUID)',
      },
      uri: {
        type: 'string',
        title: 'URI',
        default: 'TEST_URI',
      },
      effects: {
        type: 'object',
        properties: {
          professional: {
            type: 'integer',
            title: 'Professional',
            default: -5,
          },
          social: {
            type: 'integer',
            title: 'Social',
            default: 5,
          },
          personal: {
            type: 'integer',
            title: 'Personal',
            default: 0,
          },
        },
      },
      negation: {
        type: 'boolean',
        title: 'Negation',
        default: false,
      },
    },
  };

  const uiSchema = {
    uri: { 'ui:emptyValue': '' },
    effects: {
      professional: { 'ui:widget': 'updown' },
      social: { 'ui:widget': 'updown' },
      personal: { 'ui:widget': 'updown' },
    },
  };

  function open() {
    setIsOpen(true);
  }

  function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      await addRule(formData);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <FormDialog
      buttonTitle="Add Rule"
      formTitle="Add Rule"
      formText="Add a rule."
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
function UpdateRuleFormDialog() {
  return (
    <Button variant="outlined" onClick={() => console.error('Not implemented')}>
      Update
    </Button>
  );
}
