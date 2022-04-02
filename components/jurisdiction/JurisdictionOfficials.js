import { useEffect, useState } from 'react';
import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileList from 'components/profile/ProfileList';
import useProfile from 'hooks/useProfile';
import useSubgraph from 'hooks/useSubgraph';
import useToasts from 'hooks/useToasts';

/**
 * A component with jurisdiction officials (judges, admins).
 */
export default function JurisdictionOfficials() {
  const { showToastError } = useToasts();
  const { findJurisdictionParticipantEntities } = useSubgraph();
  const { getProfiles } = useProfile();

  const [judgeProfiles, setJudgeProfiles] = useState(null);
  const [adminProfiles, setAdminProfiles] = useState(null);

  async function loadData() {
    try {
      const participants = await findJurisdictionParticipantEntities();
      const judgeProfiles = await getProfiles(
        participants
          .filter((participant) => participant?.isJudge)
          .map((participant) => participant?.id),
      );
      const adminProfiles = await getProfiles(
        participants
          .filter((participant) => participant?.isAdmin)
          .map((participant) => participant?.id),
      );
      setJudgeProfiles(judgeProfiles);
      setAdminProfiles(adminProfiles);
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
        Officials
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ mt: 6 }}>
        <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
          Judges
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <ProfileList profiles={judgeProfiles} />
      </Box>
      <Box sx={{ mt: 6 }}>
        <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
          Admins
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <ProfileList profiles={adminProfiles} />
      </Box>
    </Box>
  );
}
