import useSubgraph from "hooks/useSubgraph";
import useIpfs from "hooks/useIpfs";

/**
 * Hook for work with profiles.
 */
export default function useProfile() {

  const { findAvatarNftEntity, findAvatarNftEntites } = useSubgraph();
  const { loadJsonFromIPFS } = useIpfs();

  /**
   * Get profile for specified account.
   * 
   * @returns {Promise.<Profile>} A profile or null if profile not found.
   */
  let getProfile = async function (account) {
    const avatarNftEntity = await findAvatarNftEntity(account);
    if (avatarNftEntity) {
      return new Profile(avatarNftEntity.owner, avatarNftEntity.id, await loadJsonFromIPFS(avatarNftEntity.uri));
    } else {
      return null;
    }
  }

  /**
   * Get profiles.
   * 
   * @param {Array.<string>} accounts If not null, then the function returns the profiles for the specified accounts.
   * @returns {Promise.<Array.<Profile>>} A list with profiles.
   */
  let getProfiles = async function (accounts) {
    const avatarNftEntities = await findAvatarNftEntites(accounts);
    const profiles = await Promise.all(avatarNftEntities.map(async avatarNftEntity => {
      try {
        return new Profile(avatarNftEntity.owner, avatarNftEntity.id, await loadJsonFromIPFS(avatarNftEntity.uri));
      } catch (error) {
        return null;
      }
    }));
    return profiles;
  }

  return {
    getProfile,
    getProfiles
  };
}

/**
 * Function that returns profile object.
 */
function Profile(account, avatarNftId, avatarNftMetadata) {
  return {
    account: account,
    avatarNftId: avatarNftId,
    avatarNftMetadata: avatarNftMetadata
  };
}