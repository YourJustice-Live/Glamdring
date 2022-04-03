import { useEffect, useState } from 'react';
import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileList from 'components/profile/ProfileList';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';

/**
 * A component with jurisdiction members.
 */
export default function JurisdictionMembers() {
  const { showToastError } = useToasts();
  const { getJurisdictionMemberProfiles } = useProfile();

  const [memberProfiles, setMemberProfiles] = useState();

  async function loadData() {
    try {
      setMemberProfiles(await getJurisdictionMemberProfiles());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ mb: 12 }}>
      <Typography variant="h1" gutterBottom>
        Members
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <ProfileList profiles={memberProfiles} />
    </Box>
  );
}
