import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import ProfileCases from 'components/profile/ProfileCases';
import ProfileMeta from 'components/profile/ProfileMeta';
import ProfileRatings from 'components/profile/ProfileRatings';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * Page with profile data.
 */
export default function Profile() {
  const router = useRouter();
  const { queryAccount } = router.query;
  const { account } = useWeb3Context();
  const { showToastError } = useToasts();
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState(null);

  async function loadData() {
    try {
      setProfile(await getProfile(queryAccount));
    } catch (error) {
      showToastError(error);
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
      <ProfileRatings profile={profile} sx={{ mt: 6 }} />
      <Box sx={{ mt: 8 }}>
        <Typography variant="h1" gutterBottom>
          Cases
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <ProfileCases profile={profile} />
      </Box>
    </Layout>
  );
}
