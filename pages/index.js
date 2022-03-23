import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import ProfileList from 'components/profile/ProfileList';
import useAccount from "hooks/useAccount";
import useProfile from 'hooks/useProfile';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

export default function Index() {

  const { account } = useAccount();

  const { enqueueSnackbar } = useSnackbar();
  const { getProfiles } = useProfile();
  const [profiles, setProfiles] = useState(null);

  async function loadData() {
    try {
      setProfiles(await getProfiles());
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout showAccountNavigation={!!account}>
      {!account && (
        <Box sx={{ p: 18, textAlign: 'center' }}>
          <Typography variant='h2' gutterBottom>Check or impact reputation of crypto people!</Typography>
          <Typography variant='h5'>who was involved in the activities that made you uncomfortable?</Typography>
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
