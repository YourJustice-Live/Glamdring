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
      return new Profile(avatarNftEntity.owner, avatarNftEntity.id, await loadJsonFromIPFS(avatarNftEntity.tokenUri));
    } else {
      return null;
    }
  }

  /**
   * Get all profiles.
   * 
   * @returns {Promise.<Array.<Profile>>} A list with profiles.
   */
  let getProfiles = async function () {
    const avatarNftEntities = await findAvatarNftEntites();
    const profiles = await Promise.all(avatarNftEntities.map(async avatarNftEntity => {
      try {
        return new Profile(avatarNftEntity.owner, await loadJsonFromIPFS(avatarNftEntity.tokenUri));
      } catch (error) {
        console.error(error);
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