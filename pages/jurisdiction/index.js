import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { Box } from '@mui/system';
import JurisdictionCaseCreator from 'components/jurisdiction/JurisdictionCaseCreator';
import JurisdictionCases from 'components/jurisdiction/JurisdictionCases';
import JurisdictionLaws from 'components/jurisdiction/JurisdictionLaws';
import JurisdictionMembers from 'components/jurisdiction/JurisdictionMembers';
import JurisdictionMeta from 'components/jurisdiction/JurisdictionMeta';
import JurisdictionOfficials from 'components/jurisdiction/JurisdictionOfficials';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/useWeb3Context';
import { useState } from 'react';

/**
 * Page with the jurisdiction.
 */
export default function Jurisdiction() {
  const { account } = useWeb3Context();

  const [tabValue, setTabValue] = useState('1');

  const handleChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

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
      {/* Tabs */}
      <Box sx={{ width: '100%', mt: 12 }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Cases" value="1" />
              <Tab label="Officials" value="2" />
              <Tab label="Citizen" value="3" />
              <Tab label="Laws" value="4" />
            </TabList>
          </Box>
          {/* Cases */}
          <TabPanel value="1" sx={{ px: 0 }}>
            <JurisdictionCases />
          </TabPanel>
          {/* Officials */}
          <TabPanel value="2" sx={{ px: 0 }}>
            <JurisdictionOfficials />
          </TabPanel>
          {/* Members */}
          <TabPanel value="3" sx={{ px: 0 }}>
            <JurisdictionMembers />
          </TabPanel>
          {/* Laws */}
          <TabPanel value="4" sx={{ px: 0 }}>
            <JurisdictionLaws />
          </TabPanel>
        </TabContext>
      </Box>
    </Layout>
  );
}
