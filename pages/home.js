import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import ProfileList from 'components/profile/ProfileList';
import ProfileNavigation from 'components/profile/ProfileNavigation';
import useAccount from "hooks/useAccount";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {

  const router = useRouter();
  const { account } = useAccount();

  useEffect(() => {
    // Redirect to index page if account not connected
    if (!account) {
      router.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Layout title={"YourJustice / Home"}>
      <ProfileNavigation />
      <Box sx={{ flexGrow: 1 }}>
        <ProfileList />
      </Box>
    </Layout >
  )
}