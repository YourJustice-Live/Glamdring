import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { Box } from '@mui/system';
import CaseListObserver from 'components/case/CaseListObserver';
import Layout from 'components/layout/Layout';
import ProfileCaseStats from 'components/profile/ProfileCaseStats';
import ProfileMeta from 'components/profile/ProfileMeta';
import ProfileRatingActions from 'components/profile/ProfileRatingActions';
import ProfileRatings from 'components/profile/ProfileRatings';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useErrors from 'hooks/useErrors';
import useProfile from 'hooks/useProfile';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * Page with profile data.
 *
 * TODO: Show "Not Found" message if profile is not found.
 */
export default function Profile() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { queryId } = router.query;
  const { account } = useWeb3Context();
  const { handleError } = useErrors();
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState(null);

  async function loadData() {
    try {
      setProfile(await getProfile({ id: queryId }));
    } catch (error) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    if (queryId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryId]);

  return (
    <Layout
      title={`${t('page-title-profile')} ${profile?.owner}`}
      enableSidebar={!!account}
    >
      <ProfileMeta profile={profile} />
      <ProfileRatings profile={profile} sx={{ mt: 4 }} />
      <ProfileCaseStats profile={profile} sx={{ mt: 6 }} />
      <ProfileRatingActions profile={profile} sx={{ mt: 6 }} />
      {profile && (
        <Box sx={{ width: '100%', mt: 4 }}>
          <TabContext value="1">
            <TabList
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                mb: 1,
                maxWidth: 'calc(100vw - 32px)',
              }}
            >
              <Tab label={t('text-cases')} value="1" />
            </TabList>
            <TabPanel value="1" sx={{ px: 0 }}>
              <CaseListObserver
                filters={{
                  participantProfileId: profile.id,
                }}
                isParticipantInputDisabled={true}
              />
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
