import ProfileList from 'components/profile/ProfileList';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A component with jurisdiction members.
 */
export default function JurisdictionMembers({ jurisdiction }) {
  const { showToastError } = useToasts();
  const { getProfiles } = useProfile();

  const [memberProfiles, setMemberProfiles] = useState();

  async function loadData() {
    try {
      const memberRole = jurisdiction.roles.find(
        (role) => role.roleId === JURISDICTION_ROLE.member.id,
      );
      setMemberProfiles(
        memberRole?.accounts ? await getProfiles(memberRole.accounts) : [],
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

  return <ProfileList profiles={memberProfiles} />;
}
