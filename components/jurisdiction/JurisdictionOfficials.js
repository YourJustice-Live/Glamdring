import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ProfileList from 'components/profile/ProfileList';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import useProfile from 'hooks/useProfile';
import { useEffect, useState } from 'react';

/**
 * A component with jurisdiction officials (judges, admins).
 */
export default function JurisdictionOfficials({ jurisdiction }) {
  const { handleError } = useErrors();
  const { getJurisdictionRoleAccounts } = useJurisdiction();
  const { getProfiles } = useProfile();
  const [judgeProfiles, setJudgeProfiles] = useState(null);
  const [adminProfiles, setAdminProfiles] = useState(null);

  async function loadData() {
    try {
      const judgeAccounts = getJurisdictionRoleAccounts(
        jurisdiction,
        JURISDICTION_ROLE.judge.id,
      );
      const adminAccounts = getJurisdictionRoleAccounts(
        jurisdiction,
        JURISDICTION_ROLE.admin.id,
      );
      setJudgeProfiles(
        await getProfiles({ owners: judgeAccounts, first: 25, skip: 0 }),
      );
      setAdminProfiles(
        await getProfiles({ owners: adminAccounts, first: 25, skip: 0 }),
      );
    } catch (error) {
      handleError(error, true);
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
        <ProfileList profiles={judgeProfiles} jurisdiction={jurisdiction} />
      </Box>
      <Box sx={{ mt: 6 }}>
        <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
          Admins
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <ProfileList profiles={adminProfiles} jurisdiction={jurisdiction} />
      </Box>
    </>
  );
}
