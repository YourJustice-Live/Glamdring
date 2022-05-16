import { Construction } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';
import { PROFILE_INVITING_DISABLED } from 'constants/features';

/**
 * Page where account can create profile for another person.
 */
export default function ProfileInvite() {
  return (
    <Layout title={'YourJustice / Invite Person'} enableSidebar={true}>
      {PROFILE_INVITING_DISABLED ? (
        <Box>
          <Typography variant="h1" gutterBottom>
            Feature is under development
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Construction fontSize="small" />
            <Typography>
              The ability to invite another persons will appear very soon.
            </Typography>
          </Stack>
        </Box>
      ) : (
        <ProfileManage action="createAnotherProfile" />
      )}
    </Layout>
  );
}
