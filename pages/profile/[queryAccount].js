import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import ProfileCases from 'components/profile/ProfileCases';
import ProfileMeta from 'components/profile/ProfileMeta';
import useWeb3Context from 'hooks/useWeb3Context';
import { useRouter } from 'next/router';

/**
 * Page with profile data.
 */
export default function Profile() {
  const router = useRouter();
  const { queryAccount } = router.query;
  const { account } = useWeb3Context();

  return (
    <Layout title={'YourJustice / Profile'} enableSidebar={!!account}>
      <Box>
        <Typography variant="h1" gutterBottom>
          Profile
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <ProfileMeta account={queryAccount} />
      </Box>
      <Box sx={{ mt: 12 }}>
        <Typography variant="h1" gutterBottom>
          Profile Cases
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <ProfileCases account={queryAccount} />
      </Box>
    </Layout>
  );
}
