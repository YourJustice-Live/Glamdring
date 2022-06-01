/**
 * Class for the profile.
 */
export default class Profile {
  constructor(
    account,
    avatarNftId,
    avatarNftUri,
    avatarNftUriData,
    avatarNftUriImage,
    avatarNftUriFirstName,
    avatarNftUriLastName,
    avatarNftReputations,
    avatarNftTotalNegativeRating,
    avatarNftTotalPositiveRating,
    avatarNftTotalNegativeCases,
    avatarNftTotalPositiveCases,
  ) {
    this.account = account;
    this.avatarNftId = avatarNftId;
    this.avatarNftUri = avatarNftUri;
    this.avatarNftUriData = avatarNftUriData;
    this.avatarNftUriImage = avatarNftUriImage;
    this.avatarNftUriFirstName = avatarNftUriFirstName;
    this.avatarNftUriLastName = avatarNftUriLastName;
    this.avatarNftReputations = avatarNftReputations;
    this.avatarNftTotalNegativeRating = avatarNftTotalNegativeRating;
    this.avatarNftTotalPositiveRating = avatarNftTotalPositiveRating;
    this.avatarNftTotalNegativeCases = avatarNftTotalNegativeCases;
    this.avatarNftTotalPositiveCases = avatarNftTotalPositiveCases;
  }
}
