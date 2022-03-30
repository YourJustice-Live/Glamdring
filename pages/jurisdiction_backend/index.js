import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import ActionManager from 'components/jurisdiction_backend/ActionManager';
import RoleManager from 'components/jurisdiction_backend/RoleManager';
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
  const { findActionEntities } = useSubgraph();
  const { account } = useWeb3Context();

  const [actions, setActions] = useState([]);

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
  }, [])

  const actionColumns = [
    { field: 'id', headerName: 'ID' },
    { field: 'guid', headerName: 'GUID' },
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

  return (
    <Layout title={"YourJustice / Jurisdiction Backend"} showAccountNavigation={!!account}>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h1' gutterBottom>Jurisdiction Backend</Typography>
        <Divider />
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h4' gutterBottom>Roles</Typography>
        <Divider sx={{ mb: 2.5 }} />
        <RoleManager />
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h4' gutterBottom>Actions</Typography>
        <Divider sx={{ mb: 2.5 }} />
        <Stack direction='row' spacing={2}>
          <ActionManager />
          <Button variant="outlined" onClick={() => { setActions([]); loadActions(); }}>Update data</Button>
        </Stack>
        <Box sx={{ height: 400, mt: 2.5 }}>
          <DataGrid rows={actions} columns={actionColumns} />
        </Box>
      </Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant='h4' gutterBottom>Rules</Typography>
        <Divider sx={{ mb: 2.5 }} />
        <Typography variant='h4'>...</Typography>
      </Box>
    </Layout >
  )

}