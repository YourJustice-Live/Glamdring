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
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
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
        <UpdateRuleFormDialog />
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
    properties: {
      rule: {
        type: 'object',
        title: 'Rule',
        required: ['about'],
        properties: {
          about: {
            type: 'string',
            title: 'About (Action GUID)',
          },
          affected: {
            type: 'string',
            title: 'Affected',
            default: 'investor',
          },
          negation: {
            type: 'boolean',
            title: 'Negation',
            default: false,
          },
          uri: {
            type: 'string',
            title: 'URI',
            default: 'ipfs://QmRuT4Wi5FWpBMagB8JMZBxqYyB9BHrXV5PC2d7mZzHTzC',
          },
          effects: {
            type: 'object',
            properties: {
              environmental: {
                type: 'integer',
                title: 'Environmental',
                default: 0,
              },
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
    },
  };

  const uiSchema = {
    rule: {
      affected: { 'ui:emptyValue': '' },
      uri: { 'ui:emptyValue': '' },
      effects: {
        environmental: { 'ui:widget': 'updown' },
        professional: { 'ui:widget': 'updown' },
        social: { 'ui:widget': 'updown' },
        personal: { 'ui:widget': 'updown' },
      },
    },
    confirmation: {
      ruling: { 'ui:emptyValue': '' },
      witness: { 'ui:widget': 'updown' },
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
      await addRule(formData.rule, formData.confirmation);
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
 * A form for updating a specified rule.
 */
function UpdateRuleFormDialog() {
  const { showToastSuccess, showToastError } = useToasts();
  const { updateRule } = useJuridictionContract();
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        title: 'ID',
      },
      rule: {
        type: 'object',
        title: 'Rule',
        required: ['about'],
        properties: {
          about: {
            type: 'string',
            title: 'About (Action GUID)',
          },
          affected: {
            type: 'string',
            title: 'Affected',
            default: 'investor',
          },
          negation: {
            type: 'boolean',
            title: 'Negation',
            default: false,
          },
          uri: {
            type: 'string',
            title: 'URI',
            default: 'ipfs://QmRuT4Wi5FWpBMagB8JMZBxqYyB9BHrXV5PC2d7mZzHTzC',
          },
          effects: {
            type: 'object',
            properties: {
              environmental: {
                type: 'integer',
                title: 'Environmental',
                default: 0,
              },
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
        },
      },
    },
  };

  const uiSchema = {
    rule: {
      affected: { 'ui:emptyValue': '' },
      uri: { 'ui:emptyValue': '' },
      effects: {
        environmental: { 'ui:widget': 'updown' },
        professional: { 'ui:widget': 'updown' },
        social: { 'ui:widget': 'updown' },
        personal: { 'ui:widget': 'updown' },
      },
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
      await updateRule(formData.id, formData.rule);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <FormDialog
      buttonTitle="Update Rule"
      formTitle="Update Rule"
      formText="Update a specified rule."
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
