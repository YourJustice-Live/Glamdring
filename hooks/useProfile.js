import Profile from 'classes/Profile';
import useSubgraph from 'hooks/useSubgraph';
import { hexStringToJson } from 'utils/converters';

/**
 * Hook for work with profiles.
 */
export default function useProfile() {
  const { findAvatarNftEntities, findAvatarNftEntitiesBySearchQuery } =
    useSubgraph();

  /**
   * Get profile for specified account.
   *
   * @param {string} account Account address.
   * @returns {Promise.<Profile>} A profile or null if profile not found.
   */
  let getProfile = async function (account) {
    if (!account) {
      return null;
    }
    const accounts = await getProfiles([account]);
    return accounts && accounts.length > 0 ? accounts[0] : null;
  };

  /**
   * Get profiles.
   *
   * @param {Array.<string>} accounts If not null, then the function returns the profiles for the specified accounts.
   * @param {string} jurisdiction Jurisdiction address.
   * @param {number} first The number of profiles to getting.
   * @param {number} skip The number of profiles to skip.
   * @param {String} order Profiles order. See subgraph constants.
   * @returns {Promise.<Array.<Profile>>} A list with profiles.
   */
  let getProfiles = async function (
    accounts,
    jurisdiction,
    first,
    skip,
    order,
  ) {
    const avatarNftEntities = await findAvatarNftEntities(
      accounts,
      jurisdiction,
      first,
      skip,
      order,
    );
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

  return {
    getProfile,
    getProfiles,
    getProfilesBySearchQuery,
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
    avatarNftEntity.id,
    avatarNftEntity.owner,
    avatarNftEntity.uri,
    hexStringToJson(avatarNftEntity.uriData),
    avatarNftEntity.uriImage,
    avatarNftEntity.uriFirstName,
    avatarNftEntity.uriLastName,
    avatarNftEntity.reputations,
    avatarNftEntity.totalNegativeRating,
    avatarNftEntity.totalPositiveRating,
  );
}
