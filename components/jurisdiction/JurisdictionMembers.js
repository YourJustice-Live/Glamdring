import ProfileList from 'components/profile/ProfileList';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useJurisdiction from 'hooks/useJurisdiction';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A component with jurisdiction members.
 */
export default function JurisdictionMembers({ jurisdiction }) {
  const { showToastError } = useToasts();
  const { getJurisdictionRoleAccounts } = useJurisdiction();
  const { getProfiles } = useProfile();

  const [memberProfiles, setMemberProfiles] = useState();

  async function loadData() {
    try {
      const memberAccounts = getJurisdictionRoleAccounts(
        jurisdiction,
        JURISDICTION_ROLE.member.id,
      );
      setMemberProfiles(await getProfiles(memberAccounts));
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

  return <ProfileList profiles={memberProfiles} />;
}
