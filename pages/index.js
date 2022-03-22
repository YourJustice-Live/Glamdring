import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import ProfileList from 'components/profile/ProfileList';
import useAccount from "hooks/useAccount";

export default function Index() {

  const { account } = useAccount();

  return (
    <Layout showAccountNavigation={!!account}>
      {!account && (
        <Box sx={{ p: 18, textAlign: 'center' }}>
          <Typography variant='h2' gutterBottom>Check or impact reputation of crypto people!</Typography>
          <Typography variant='h5'>who was involved in the activities that made you uncomfortable?</Typography>
        </Box>
      )}
      <ProfileList />
    </Layout>
  )

}
