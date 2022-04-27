import { REPUTATION_RATING } from 'constants/contracts';

/**
 * Get a rating for specified profile, domain id and rating id.
 *
 * @param {object} profile Profile.
 * @param {number} domain Domain ID.
 * @param {number} rating Rating ID.
 * @returns {string} Rating.
 */
export function getRating(profile, domain, rating) {
  let result = '0';
  profile?.avatarNftReputations?.forEach((reputation) => {
    if (
      reputation.domain === domain &&
      rating === REPUTATION_RATING.negative.id
    ) {
      result = reputation.negativeRating;
    }
    if (
      reputation.domain === domain &&
      rating === REPUTATION_RATING.positive.id
    ) {
      result = reputation.positiveRating;
    }
  });
  return result;
}
