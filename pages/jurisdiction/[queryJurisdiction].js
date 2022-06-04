import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { Box } from '@mui/system';
import CaseListObserver from 'components/case/CaseListObserver';
import JurisdictionLaws from 'components/jurisdiction/JurisdictionLaws';
import JurisdictionManagerTools from 'components/jurisdiction/JurisdictionManagerTools';
import JurisdictionMembers from 'components/jurisdiction/JurisdictionMembers';
import JurisdictionMeta from 'components/jurisdiction/JurisdictionMeta';
import JurisdictionOfficials from 'components/jurisdiction/JurisdictionOfficials';
import Layout from 'components/layout/Layout';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * Page with jurisdiction data.
 */
export default function Jurisdiction() {
  const router = useRouter();
  const { queryJurisdiction } = router.query;
  const { account } = useWeb3Context();
  const { handleError } = useErrors();
  const { getJurisdiction } = useJurisdiction();
  const [tabValue, setTabValue] = useState('1');
  const [jurisdiction, setJurisdiction] = useState(null);
  const [officialsCount, setOfficialsCount] = useState(null);
  const [citizensCount, setCitizensCount] = useState(null);

  function handleChange(_, newTabValue) {
    setTabValue(newTabValue);
  }

  async function loadData() {
    try {
      const jurisdiction = await getJurisdiction(queryJurisdiction);
      if (jurisdiction) {
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
          (judgeRole?.accountsCount || 0) + (adminRole?.accountsCount || 0),
        );
        setCitizensCount(memberRole?.accountsCount || 0);
      }
    } catch (error) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    setJurisdiction(null);
    setOfficialsCount(null);
    setCitizensCount(null);
    if (queryJurisdiction) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryJurisdiction]);

  return (
    <Layout title={'YourJustice / Jurisdiction'} enableSidebar={!!account}>
      {/* Meta */}
      <JurisdictionMeta jurisdiction={jurisdiction} />
      {/* Manager Tools */}
      <JurisdictionManagerTools jurisdiction={jurisdiction} sx={{ mt: 4 }} />
      {/* Tabs */}
      {jurisdiction && (
        <Box sx={{ width: '100%', mt: 4 }}>
          <TabContext value={tabValue}>
            <TabList
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                mb: 1,
                maxWidth: 'calc(100vw - 32px)',
              }}
            >
              <Tab
                label={
                  jurisdiction.casesCount
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
                  jurisdiction.rulesCount
                    ? `Laws: ${jurisdiction.rulesCount}`
                    : 'Laws'
                }
                value="4"
              />
            </TabList>
            {/* Cases */}
            <TabPanel value="1" sx={{ px: 0 }}>
              <CaseListObserver
                filters={{
                  jurisdictionAddress: jurisdiction.id,
                }}
                isJurisdictionInputDisabled={true}
              />
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
      )}
    </Layout>
  );
}
