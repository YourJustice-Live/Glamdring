import useSubgraph from "hooks/useSubgraph";
import useIpfs from "hooks/useIpfs";

export default function useProfile() {

  const { findAvatarNftEntity, findAvatarNftEntites } = useSubgraph();
  const { loadJsonFromIPFS } = useIpfs();

  let getProfile = async function (account) {
    const avatarNftEntity = await findAvatarNftEntity(account);
    if (avatarNftEntity) {
      const profile = {
        account: avatarNftEntity.owner,
        avatarNftMetadata: await loadJsonFromIPFS(avatarNftEntity.tokenUri)
      };
      return profile;
    } else {
      return null;
    }
  }

  let getProfiles = async function () {
    const avatarNftEntities = await findAvatarNftEntites();
    const profiles = await Promise.all(avatarNftEntities.map(async avatarNftEntity => {
      try {
        return {
          account: avatarNftEntity.owner,
          avatarNftMetadata: await loadJsonFromIPFS(avatarNftEntity.tokenUri)
        }
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