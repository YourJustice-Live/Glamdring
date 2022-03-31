import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ActionManager from 'components/jurisdiction_backend/ActionManager';
import RoleManager from 'components/jurisdiction_backend/RoleManager';
import RuleManager from 'components/jurisdiction_backend/RuleManager';
import Layout from 'components/layout/Layout';
import useSubgraph from 'hooks/useSubgraph';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { useEffect, useState } from 'react';

/**
 * Page with a backend of the jurisdiction.
 */
export default function JurisdictionBackend() {
  const { showToastError } = useToasts();
  const { findActionEntities, findJurisdictionRuleEntities } = useSubgraph();
  const { account } = useWeb3Context();

  const [actions, setActions] = useState([]);
  const [rules, setRules] = useState([]);

  async function loadActions() {
    try {
      setActions(await findActionEntities());
    } catch (error) {
      showToastError(error);
    }
  }

  async function loadRules() {
    try {
      setRules(await findJurisdictionRuleEntities());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadActions();
    loadRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionColumns = [
    { field: 'id', headerName: 'ID (GUID)' },
    { field: 'subject', headerName: 'Subject' },
    { field: 'verb', headerName: 'Verb' },
    { field: 'object', headerName: 'Object' },
    { field: 'tool', headerName: 'Tool' },
    { field: 'affected', headerName: 'Affected' },
    { field: 'confirmationRuling', headerName: 'Confirmation Ruling' },
    { field: 'confirmationEvidence', headerName: 'Confirmation Evidence' },
    { field: 'confirmationWitness', headerName: 'Confirmation Witness' },
    { field: 'uri', headerName: 'URI' },
  ];

  const ruleColumns = [
    { field: 'id', headerName: 'ID' },
    { field: 'about', headerName: 'About (Action GUID)' },
    { field: 'uri', headerName: 'URI' },
    { field: 'effectsProfessional', headerName: 'Effects Professional' },
    { field: 'effectsSocial', headerName: 'Effects Social' },
    { field: 'effectsPersonal', headerName: 'Effects Personal' },
    { field: 'negation', headerName: 'Negation' },
  ];

  return (
    <Layout
      title={'YourJustice / Jurisdiction Backend'}
      showAccountNavigation={!!account}
    >
      <Box sx={{ mb: 5 }}>
        <Typography variant="h1" gutterBottom>
          Jurisdiction Backend
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          Roles
        </Typography>
        <Divider sx={{ mb: 2.5 }} />
        <RoleManager />
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          Actions
        </Typography>
        <Divider sx={{ mb: 2.5 }} />
        <Stack direction="row" spacing={2}>
          <ActionManager />
          <Button
            variant="outlined"
            onClick={() => {
              setActions([]);
              loadActions();
            }}
          >
            Reload data
          </Button>
        </Stack>
        <Box sx={{ height: 400, mt: 2.5 }}>
          <DataGrid rows={actions} columns={actionColumns} />
        </Box>
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" gutterBottom>
          Rules
        </Typography>
        <Divider sx={{ mb: 2.5 }} />
        <Stack direction="row" spacing={2}>
          <RuleManager />
          <Button
            variant="outlined"
            onClick={() => {
              setRules([]);
              loadRules();
            }}
          >
            Reload data
          </Button>
        </Stack>
        <Box sx={{ height: 400, mt: 2.5 }}>
          <DataGrid rows={rules} columns={ruleColumns} />
        </Box>
      </Box>
    </Layout>
  );
}
