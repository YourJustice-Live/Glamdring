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
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * Page with profile data.
 */
export default function Profile() {
  const router = useRouter();
  const { queryAccount } = router.query;
  const { account } = useWeb3Context();
  const { handleError } = useErrors();
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState(null);

  async function loadData() {
    try {
      setProfile(await getProfile(queryAccount));
    } catch (error) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    if (queryAccount) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryAccount]);

  return (
    <Layout title={'YourJustice / Profile'} enableSidebar={!!account}>
      <ProfileMeta profile={profile} />
      <ProfileRatings profile={profile} sx={{ mt: 4 }} />
      <ProfileCaseStats profile={profile} sx={{ mt: 6 }} />
      <ProfileRatingActions profile={profile} sx={{ mt: 6 }} />
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
            <Tab label="Cases" value="1" />
          </TabList>
          <TabPanel value="1" sx={{ px: 0 }}>
            <CaseListObserver
              filters={{
                participantProfileAccount: queryAccount,
              }}
              isParticipantInputDisabled={true}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </Layout>
  );
}
