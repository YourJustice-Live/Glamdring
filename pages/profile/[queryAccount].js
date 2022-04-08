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
    <Layout title={'YourJustice / Profile'} showAccountNavigation={!!account}>
      <Box>
        <ProfileMeta account={queryAccount} />
      </Box>
      <Box sx={{ mt: 12 }}>
        <ProfileCases />
      </Box>
    </Layout>
  );
}
