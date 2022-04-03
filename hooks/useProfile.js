import useIpfs from 'hooks/useIpfs';
import useSubgraph from 'hooks/useSubgraph';
import Profile from 'objects/Profile';

/**
 * Hook for work with profiles.
 */
export default function useProfile() {
  const { findAvatarNftEntities, findJurisdictionParticipantEntities } =
    useSubgraph();
  const { loadJsonFromIPFS } = useIpfs();

  /**
   * Get profile for specified account.
   *
   * @returns {Promise.<Profile>} A profile or null if profile not found.
   */
  let getProfile = async function (account) {
    return (await getProfiles([account]))[0];
  };

  /**
   * Get profiles.
   *
   * @param {Array.<string>} accounts If not null, then the function returns the profiles for the specified accounts.
   * @returns {Promise.<Array.<Profile>>} A list with profiles.
   */
  let getProfiles = async function (accounts) {
    const avatarNftEntities = await findAvatarNftEntities(accounts);
    let profiles = [];
    for (const avatarNftEntity of avatarNftEntities) {
      try {
        const profile = new Profile(
          avatarNftEntity.owner,
          avatarNftEntity.id,
          avatarNftEntity.reputations,
          await loadJsonFromIPFS(avatarNftEntity.uri),
        );
        profiles.push(profile);
      } catch (error) {
        continue;
      }
    }
    return profiles;
  };

  /**
   * Get jurisdiction member profiles.
   *
   * @returns {Promise.<Array.<Profile>>} A list with profiles.
   */
  let getJurisdictionMemberProfiles = async function () {
    const entities = await findJurisdictionParticipantEntities('members');
    const profiles = await getProfiles(entities.map((entity) => entity?.id));
    return profiles;
  };

  /**
   * Get jurisdiction judge profiles.
   *
   * @returns {Promise.<Array.<Profile>>} A list with profiles.
   */
  let getJurisdictionJudgeProfiles = async function () {
    const entities = await findJurisdictionParticipantEntities('judges');
    const profiles = await getProfiles(entities.map((entity) => entity?.id));
    return profiles;
  };

  /**
   * Get jurisdiction admin profiles.
   *
   * @returns {Promise.<Array.<Profile>>} A list with profiles.
   */
  let getJurisdictionAdminProfiles = async function () {
    const entities = await findJurisdictionParticipantEntities('admins');
    const profiles = await getProfiles(entities.map((entity) => entity?.id));
    return profiles;
  };

  return {
    getProfile,
    getProfiles,
    getJurisdictionMemberProfiles,
    getJurisdictionJudgeProfiles,
    getJurisdictionAdminProfiles,
  };
}
