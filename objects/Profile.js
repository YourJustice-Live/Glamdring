/**
 * Function that returns profile object.
 */
export default function Profile(
  account,
  avatarNftId,
  avatarNftReputations,
  avatarNftMetadata,
) {
  return {
    account: account,
    avatarNftId: avatarNftId,
    avatarNftReputations: avatarNftReputations,
    avatarNftMetadata: avatarNftMetadata,
  };
}
