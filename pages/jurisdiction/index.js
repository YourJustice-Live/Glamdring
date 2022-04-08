import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CaseCreateDialogForm from 'components/case/CaseCreateDialogForm';
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
        <Box>
          <Typography variant="h1" gutterBottom>
            Case Creator
          </Typography>
          <Divider />
        </Box>
        <Box sx={{ mt: 3 }}>
          <CaseCreateDialogForm />
        </Box>
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
