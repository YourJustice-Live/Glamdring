import { Box } from '@mui/system';
import JurisdictionCaseCreator from 'components/jurisdiction/JurisdictionCaseCreator';
import JurisdictionCases from 'components/jurisdiction/JurisdictionCases';
import JurisdictionLaws from 'components/jurisdiction/JurisdictionLaws';
import JurisdictionMembers from 'components/jurisdiction/JurisdictionMembers';
import JurisdictionMeta from 'components/jurisdiction/JurisdictionMeta';
import JurisdictionOfficials from 'components/jurisdiction/JurisdictionOfficials';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Page with the jurisdiction.
 */
export default function Jurisdiction() {
  const { account } = useWeb3Context();

  return (
    <Layout
      title={'YourJustice / Jurisdiction'}
      showAccountNavigation={!!account}
    >
      {/* Meta */}
      <Box>
        <JurisdictionMeta />
      </Box>
      {/* Case creator */}
      <Box sx={{ mt: 12 }}>
        <JurisdictionCaseCreator />
      </Box>
      {/* Cases */}
      <Box sx={{ mt: 12 }}>
        <JurisdictionCases />
      </Box>
      {/* Officials */}
      <Box sx={{ mt: 12 }}>
        <JurisdictionOfficials />
      </Box>
      {/* Officials */}
      <Box sx={{ mt: 12 }}>
        <JurisdictionMembers />
      </Box>
      {/* Laws */}
      <Box sx={{ mt: 12 }}>
        <JurisdictionLaws />
      </Box>
    </Layout>
  );
}
