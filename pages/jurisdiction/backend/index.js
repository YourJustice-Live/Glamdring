import { Divider, Typography } from '@mui/material';
import ActionsManager from 'components/jurisdiction/backend/ActionsManager';
import RolesManager from 'components/jurisdiction/backend/RolesManager';
import RulesManager from 'components/jurisdiction/backend/RulesManager';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Page with a backend of the jurisdiction.
 */
export default function JurisdictionBackend() {
  const { account } = useWeb3Context();

  return (
    <Layout
      title={'YourJustice / Jurisdiction Backend'}
      showAccountNavigation={!!account}
    >
      <Typography variant="h1" gutterBottom>
        Jurisdiction Backend
      </Typography>
      <Divider sx={{ mb: 8 }} />
      <RolesManager />
      <ActionsManager />
      <RulesManager />
    </Layout>
  );
}
