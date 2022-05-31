import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CaseListObserver from 'components/case/CaseListObserver';
import Layout from 'components/layout/Layout';
import ProfileMeta from 'components/profile/ProfileMeta';
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
    <Layout title={'YourJustice / Profile'} enableSidebar={!!account}>
      <ProfileMeta profile={profile} />
      <ProfileRatings profile={profile} sx={{ mt: 4 }} />
      {profile && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h1" gutterBottom>
            Cases
          </Typography>
          <Divider />
          <CaseListObserver
            filters={{
              participantProfileAccount: profile?.owner,
            }}
            isParticipantInputDisabled={true}
            sx={{ mt: 4 }}
          />
        </Box>
      )}
    </Layout>
  );
}
