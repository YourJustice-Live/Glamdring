import { REPUTATION_RATING_ID } from 'constants/contracts';

/**
 * Get a rating for specified profile, domain id and rating id.
 * 
 * @param {object} profile Profile.
 * @param {number} domainId Domain ID.
 * @param {number} ratingId Rating ID.
 * @returns {number} Rating.
 */
export function getRating(profile, domainId, ratingId) {
  let rating = 0;
  profile?.avatarNftReputations?.forEach(reputation => {
    if (reputation.domain === domainId && ratingId === REPUTATION_RATING_ID.negative) {
      rating = reputation.negativeRating;
    }
    if (reputation.domain === domainId && ratingId === REPUTATION_RATING_ID.positive) {
      rating = reputation.positiveRating;
    }
  })
  return rating;
};