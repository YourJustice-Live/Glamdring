import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';

/**
 * Page where account can create profile for another person.
 */
export default function ProfileInvite() {
  const isFeatureEnabled = false;

  return (
    <Layout title={'YourJustice / Invite Person'} enableSidebar={true}>
      {isFeatureEnabled ? (
        <ProfileManage action="createAnotherProfile" />
      ) : (
        <Box>
          <Typography variant="h1" gutterBottom>
            Feature is under development
          </Typography>
          <Typography gutterBottom>
            The ability to invite another persons will appear very soon
          </Typography>
        </Box>
      )}
    </Layout>
  );
}
