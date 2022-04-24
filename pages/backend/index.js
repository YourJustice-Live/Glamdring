import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ActionRuleBackend from 'components/backend/ActionRuleBackend';
import CaseBackend from 'components/backend/CaseBackend';
import RoleBackend from 'components/backend/RoleBackend';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Page with backend features.
 */
export default function Backend() {
  const { account } = useWeb3Context();

  return (
    <Layout title={'YourJustice / Backend'} showAccountNavigation={!!account}>
      <Box>
        <Typography variant="h1" gutterBottom>
          Backend
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mt: 12 }}>
        <CaseBackend />
      </Box>
      <Box sx={{ mt: 12 }}>
        <RoleBackend />
      </Box>
      <ActionRuleBackend sx={{ mt: 12 }} />
    </Layout>
  );
}
