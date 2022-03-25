export const domainIds = {
  environment: 0,
}

export const ratingIds = {
  negative: 0,
  positive: 1,
}

/**
 * Get a rating for specified profile, domain type and rating type.
 * 
 * @param {object} profile Profile.
 * @param {number} domainId Domain type. See constants for details.
 * @param {number} ratingId Rating type. See constants for details.
 * @returns {number} Rating.
 */
export function getRating(profile, domainId, ratingId) {
  let rating = 0;
  profile?.avatarNftReputations?.forEach(reputation => {
    if (reputation.domain === domainId && ratingId === ratingIds.negative) {
      rating = reputation.negativeRating;
    }
    if (reputation.domain === domainId && ratingId === ratingIds.positive) {
      rating = reputation.positiveRating;
    }
  })
  return rating;
};