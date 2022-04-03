import useSubgraph from 'hooks/useSubgraph';
import useIpfs from 'hooks/useIpfs';
import Profile from 'objects/Profile';

/**
 * Hook for work with profiles.
 */
export default function useProfile() {
  const { findAvatarNftEntities } = useSubgraph();
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

  return {
    getProfile,
    getProfiles,
  };
}
