/**
 * Class for the profile.
 */
export default class Profile {
  constructor(
    id,
    owner,
    uri,
    uriData,
    uriImage,
    uriFirstName,
    uriLastName,
    reputations,
    totalNegativeRating,
    totalPositiveRating,
  ) {
    this.id = id;
    this.owner = owner;
    this.uri = uri;
    this.uriData = uriData;
    this.uriImage = uriImage;
    this.uriFirstName = uriFirstName;
    this.uriLastName = uriLastName;
    this.reputations = reputations;
    this.totalNegativeRating = totalNegativeRating;
    this.totalPositiveRating = totalPositiveRating;
  }
}
