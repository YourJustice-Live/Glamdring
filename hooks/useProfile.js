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
   * Get profile.
   *
   * @param {Object} params Params.
   * @param {string} params.id Profile id (token id).
   * @param {string} params.owner Account address.
   * @returns {Promise.<Profile>} A profile or null if profile not found.
   */
  let getProfile = async function ({ id, owner }) {
    if (!id && !owner) {
      return null;
    }
    const profiles = await getProfiles({
      ids: id ? [id] : null,
      owners: owner ? [owner] : owner,
    });
    return profiles && profiles.length > 0 ? profiles[0] : null;
  };

  /**
   * Get profiles.
   *
   * @param {Object} params Params.
   * @param {Array.<string>} params.ids Profile Ids (token ids).
   * @param {Array.<string>} params.owners Addresses of owner accounts.
   * @param {string} params.jurisdiction Jurisdiction address.
   * @param {number} params.first The number of profiles to getting.
   * @param {number} params.skip The number of profiles to skip.
   * @param {String} params.order Profiles order. See subgraph constants.
   * @returns {Promise.<Array.<Profile>>} A list with profiles.
   */
  let getProfiles = async function ({
    ids,
    owners,
    jurisdiction,
    first,
    skip,
    order,
  }) {
    const avatarNftEntities = await findAvatarNftEntities(
      ids,
      owners,
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
