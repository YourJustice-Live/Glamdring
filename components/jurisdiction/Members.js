import { useEffect, useState } from 'react';
import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileList from 'components/profile/ProfileList';
import useProfile from 'hooks/useProfile';
import useSubgraph from 'hooks/useSubgraph';
import useToasts from 'hooks/useToasts';

/**
 * A component with jurisdiction members.
 */
export default function Members() {
  const { showToastError } = useToasts();
  const { findJurisdictionParticipantEntities } = useSubgraph();
  const { getProfiles } = useProfile();

  const [memberProfiles, setMemberProfiles] = useState(null);

  async function loadData() {
    try {
      const participants = await findJurisdictionParticipantEntities();
      const memberProfiles = await getProfiles(
        participants
          .filter((participant) => participant?.isMember)
          .map((participant) => participant?.id),
      );
      setMemberProfiles(memberProfiles);
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
