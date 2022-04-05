import { Divider, Typography } from '@mui/material';
import JurisdictionActionsManager from 'components/jurisdiction/backend/JurisdictionActionsManager';
import JurisdictionBackendRules from 'components/jurisdiction/backend/JurisdictionBackendRules';
import JurisdictionRolesManager from 'components/jurisdiction/backend/JurisdictionRolesManager';
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
      <JurisdictionRolesManager />
      <JurisdictionActionsManager />
      <JurisdictionBackendRules />
    </Layout>
  );
}
