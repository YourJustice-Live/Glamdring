import ProfileList from 'components/profile/ProfileList';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

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

  return <ProfileList profiles={memberProfiles} />;
}
