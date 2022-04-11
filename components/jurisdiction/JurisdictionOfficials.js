import { useEffect, useState } from 'react';
import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileList from 'components/profile/ProfileList';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';

/**
 * A component with jurisdiction officials (judges, admins).
 */
export default function JurisdictionOfficials() {
  const { showToastError } = useToasts();
  const { getJurisdictionJudgeProfiles, getJurisdictionAdminProfiles } =
    useProfile();

  const [judgeProfiles, setJudgeProfiles] = useState(null);
  const [adminProfiles, setAdminProfiles] = useState(null);

  async function loadData() {
    try {
      setJudgeProfiles(await getJurisdictionJudgeProfiles());
      setAdminProfiles(await getJurisdictionAdminProfiles());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box>
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
    </>
  );
}
