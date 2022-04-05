import { Divider, Typography } from '@mui/material';
import JurisdictionBackendActions from 'components/jurisdiction/backend/JurisdictionBackendActions';
import JurisdictionBackendRules from 'components/jurisdiction/backend/JurisdictionBackendRules';
import JurisdictionBackendRoles from 'components/jurisdiction/backend/JurisdictionBackendRoles';
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
      <JurisdictionBackendRoles />
      <JurisdictionBackendActions />
      <JurisdictionBackendRules />
    </Layout>
  );
}
