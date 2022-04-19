import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ActionBackend from 'components/backend/ActionBackend';
import CaseBackend from 'components/backend/CaseBackend';
import RoleBackend from 'components/backend/RoleBackend';
import RuleBackend from 'components/backend/RuleBackend';
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
      <Box sx={{ mt: 12 }}>
        <ActionBackend />
      </Box>
      <Box sx={{ mt: 12 }}>
        <RuleBackend />
      </Box>
    </Layout>
  );
}
