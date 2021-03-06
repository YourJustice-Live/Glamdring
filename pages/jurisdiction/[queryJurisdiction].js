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
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * Page with jurisdiction data.
 *
 * TODO: Show "Not Found" message if jurisdiction is not found.
 */
export default function Jurisdiction() {
  const router = useRouter();
  const { t } = useTranslation('common');
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
        const judges = jurisdiction.roles.find(
          (role) => role.roleId === JURISDICTION_ROLE.judge.id,
        );
        const admins = jurisdiction.roles.find(
          (role) => role.roleId === JURISDICTION_ROLE.admin.id,
        );
        const members = jurisdiction.roles.find(
          (role) => role.roleId === JURISDICTION_ROLE.member.id,
        );
        setJurisdiction(jurisdiction);
        setOfficialsCount(
          (judges?.participantsCount || 0) + (admins?.participantsCount || 0),
        );
        setCitizensCount(members?.participantsCount);
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
    <Layout
      title={`${t('page-title-jurisdiction')} ${queryJurisdiction}`}
      enableSidebar={!!account}
    >
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
                    ? `${t('text-cases')}: ${jurisdiction.casesCount}`
                    : t('text-cases')
                }
                value="1"
              />
              <Tab
                label={
                  officialsCount
                    ? `${t('text-officials')}: ${officialsCount}`
                    : t('text-officials')
                }
                value="2"
              />
              <Tab
                label={
                  citizensCount
                    ? `${t('text-citizens')}: ${citizensCount}`
                    : t('text-citizens')
                }
                value="3"
              />
              <Tab
                label={
                  jurisdiction.rulesCount
                    ? `${t('text-laws')}: ${jurisdiction.rulesCount}`
                    : t('text-laws')
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

/**
 * Define localized texts before rendering the page.
 */
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
