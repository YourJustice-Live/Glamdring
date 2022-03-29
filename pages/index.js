import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import ProfileList from 'components/profile/ProfileList';
import useWeb3Context from "hooks/useWeb3Context";
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

export default function Index() {

  const { showToastError } = useToasts();
  const { account } = useWeb3Context();
  const { getProfiles } = useProfile();
  const [profiles, setProfiles] = useState(null);

  async function loadData() {
    try {
      setProfiles(await getProfiles());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout showAccountNavigation={!!account}>
      {!account && (
        <Box sx={{ px: 4, py: 18, textAlign: 'center' }}>
          <Typography variant='h1' gutterBottom>Check or impact reputation of crypto people!</Typography>
          <Typography>who was involved in the activities that made you uncomfortable?</Typography>
        </Box>
      )}
      <Box>
        <Typography variant='h4' gutterBottom>Profiles</Typography>
        <Divider sx={{ mb: 2.5 }} />
        <ProfileList profiles={profiles} />
      </Box>
    </Layout>
  )

}
