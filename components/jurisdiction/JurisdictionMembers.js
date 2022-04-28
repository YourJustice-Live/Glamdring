import ProfileList from 'components/profile/ProfileList';
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
      setMemberProfiles(await getProfiles(null, jurisdiction.id));
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
