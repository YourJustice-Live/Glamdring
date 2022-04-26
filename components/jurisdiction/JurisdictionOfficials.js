import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileList from 'components/profile/ProfileList';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A component with jurisdiction officials (judges, admins).
 */
export default function JurisdictionOfficials({ jurisdiction }) {
  const { showToastError } = useToasts();
  const { getProfiles } = useProfile();
  const [judgeProfiles, setJudgeProfiles] = useState(null);
  const [adminProfiles, setAdminProfiles] = useState(null);

  async function loadData() {
    try {
      const judgeRole = jurisdiction.roles.find(
        (role) => role.roleId === JURISDICTION_ROLE.judge.id,
      );
      const adminRole = jurisdiction.roles.find(
        (role) => role.roleId === JURISDICTION_ROLE.admin.id,
      );
      setJudgeProfiles(
        judgeRole?.accounts ? await getProfiles(judgeRole.accounts) : [],
      );
      setAdminProfiles(
        adminRole?.accounts ? await getProfiles(adminRole.accounts) : [],
      );
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (jurisdiction) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jurisdiction]);

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
