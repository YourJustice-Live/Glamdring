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
  ) {
    this.account = account;
    this.avatarNftId = avatarNftId;
    this.avatarNftUri = avatarNftUri;
    this.avatarNftUriData = avatarNftUriData;
    this.avatarNftUriImage = avatarNftUriImage;
    this.avatarNftUriFirstName = avatarNftUriFirstName;
    this.avatarNftUriLastName = avatarNftUriLastName;
    this.avatarNftReputations = avatarNftReputations;
  }
}
