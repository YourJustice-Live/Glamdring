import Profile from 'classes/Profile';
import useSubgraph from 'hooks/useSubgraph';
import { hexStringToJson } from 'utils/converters';

/**
 * Hook for work with profiles.
 */
export default function useProfile() {
  const {
    findAvatarNftEntities,
    findAvatarNftEntitiesBySearchQuery,
    findJurisdictionParticipantEntities,
  } = useSubgraph();

  /**
   * Get profile for specified account.
   *
   * @param {string} account Account address.
   * @returns {Promise.<Profile>} A profile or null if profile not found.
   */
  let getProfile = async function (account) {
    const accounts = await getProfiles([account]);
    return accounts && accounts.length > 0 ? accounts[0] : null;
  };

  /**
   * Get profiles.
   *
   * @param {Array.<string>} accounts If not null, then the function returns the profiles for the specified accounts.
   * @returns {Promise.<Array.<Profile>>} A list with profiles.
   */
  let getProfiles = async function (accounts) {
    const avatarNftEntities = await findAvatarNftEntities(accounts);
    return avatarNftEntities.map((avatarNftEntity) =>
      createProfileObject(avatarNftEntity),
    );
  };

  /**
   * Get profiles by part of address, first name, second, name.
   *
   * @param {string} searchQuery Search query.
   * @returns {Promise.<Array.<Profile>>} A list with profiles.
   */
  let getProfilesBySearchQuery = async function (searchQuery) {
    const avatarNftEntities = await findAvatarNftEntitiesBySearchQuery(
      searchQuery,
    );
    return avatarNftEntities.map((avatarNftEntity) =>
      createProfileObject(avatarNftEntity),
    );
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
    getProfilesBySearchQuery,
    getJurisdictionMemberProfiles,
    getJurisdictionJudgeProfiles,
    getJurisdictionAdminProfiles,
  };
}

/**
 * Convert avatar nft entity to profile object.
 *
 * @param {object} profileEntity Avatar nft entity.
 * @returns Profile object.
 */
function createProfileObject(avatarNftEntity) {
  return new Profile(
    avatarNftEntity.owner,
    avatarNftEntity.id,
    avatarNftEntity.uri,
    hexStringToJson(avatarNftEntity.uriData),
    avatarNftEntity.uriImage,
    avatarNftEntity.uriFirstName,
    avatarNftEntity.uriLastName,
    avatarNftEntity.reputations,
  );
}
