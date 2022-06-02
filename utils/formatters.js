import { truncate } from 'lodash';

/**
 * Convert "0x788a4fecc0ece997b9b64528bc9e10e0219c94a2" to "0x788...94a2".
 *
 * @param {string} address Origin address.
 * @returns Formatted address.
 */
export function formatAddress(address) {
  if (address && address.length > 10) {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4,
    )}`;
  } else {
    return address;
  }
}

/**
 * Format profile first and last names to string with truncation.
 *
 * @param {Profile} profile Profile.
 * @param {number} length Max lenght of result string.
 * @returns Formatted string with first and last names or "Anonymous".
 */
export function formatProfileFirstLastName(profile, length = 36) {
  let profileFirstLastName = 'Anonymous';
  if (profile?.uriFirstName || profile?.uriLastName) {
    profileFirstLastName =
      (profile.uriFirstName || '') + ' ' + (profile.uriLastName || '');
  }
  return truncate(profileFirstLastName, { length: length });
}
