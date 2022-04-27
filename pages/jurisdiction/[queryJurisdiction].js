import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { Box } from '@mui/system';
import JurisdictionCases from 'components/jurisdiction/JurisdictionCases';
import JurisdictionLaws from 'components/jurisdiction/JurisdictionLaws';
import JurisdictionMembers from 'components/jurisdiction/JurisdictionMembers';
import JurisdictionMeta from 'components/jurisdiction/JurisdictionMeta';
import JurisdictionOfficials from 'components/jurisdiction/JurisdictionOfficials';
import Layout from 'components/layout/Layout';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * Page with jurisdiction data.
 */
export default function Jurisdiction() {
  const router = useRouter();
  const { queryJurisdiction } = router.query;
  const { account } = useWeb3Context();
  const { showToastError } = useToasts();
  const { getJurisdiction } = useJurisdiction();
  const [tabValue, setTabValue] = useState('1');
  const [jurisdiction, setJurisdiction] = useState(null);
  const [officialsCount, setOfficialsCount] = useState(null);
  const [citizensCount, setCitizensCount] = useState(null);

  const handleChange = (_, newTabValue) => {
    setTabValue(newTabValue);
  };

  async function loadData() {
    try {
      const jurisdiction = await getJurisdiction(queryJurisdiction);
      const judgeRole = jurisdiction.roles.find(
        (role) => role.roleId === JURISDICTION_ROLE.judge.id,
      );
      const adminRole = jurisdiction.roles.find(
        (role) => role.roleId === JURISDICTION_ROLE.admin.id,
      );
      const memberRole = jurisdiction.roles.find(
        (role) => role.roleId === JURISDICTION_ROLE.member.id,
      );
      setJurisdiction(jurisdiction);
      setOfficialsCount(
        judgeRole?.accountsCount && adminRole?.accountsCount
          ? judgeRole.accountsCount + adminRole.accountsCount
          : null,
      );
      setCitizensCount(memberRole?.accountsCount);
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (queryJurisdiction) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryJurisdiction]);

  return (
    <Layout title={'YourJustice / Jurisdiction'} enableSidebar={!!account}>
      {/* Meta */}
      <Box>
        <JurisdictionMeta jurisdiction={jurisdiction} />
      </Box>
      {/* Tabs */}
      <Box sx={{ width: '100%', mt: 12 }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <TabList onChange={handleChange}>
              <Tab
                label={
                  jurisdiction?.casesCount
                    ? `Cases: ${jurisdiction.casesCount}`
                    : 'Cases'
                }
                value="1"
              />
              <Tab
                label={
                  officialsCount ? `Officials: ${officialsCount}` : 'Officials'
                }
                value="2"
              />
              <Tab
                label={
                  citizensCount ? `Citizens: ${citizensCount}` : 'Citizens'
                }
                value="3"
              />
              <Tab
                label={
                  jurisdiction?.rulesCount
                    ? `Laws: ${jurisdiction.rulesCount}`
                    : 'Laws'
                }
                value="4"
              />
            </TabList>
          </Box>
          {/* Cases */}
          <TabPanel value="1" sx={{ px: 0 }}>
            <JurisdictionCases jurisdiction={jurisdiction} />
          </TabPanel>
          {/* Officials */}
          <TabPanel value="2" sx={{ px: 0 }}>
            <JurisdictionOfficials jurisdiction={jurisdiction} />
          </TabPanel>
          {/* Members */}
          <TabPanel value="3" sx={{ px: 0 }}>
            <JurisdictionMembers jurisdiction={jurisdiction} />
          </TabPanel>
          {/* Laws */}
          <TabPanel value="4" sx={{ px: 0 }}>
            <JurisdictionLaws jurisdiction={jurisdiction} />
          </TabPanel>
        </TabContext>
      </Box>
    </Layout>
  );
}
