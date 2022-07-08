import { capitalize, truncate } from 'lodash';

/**
 * Convert "0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1" to "0x430...c4b1".
 *
 * @param {string} address Origin address.
 * @returns Formatted address.
 */
export function formatAddress(address) {
  let formattedAddress = address;
  if (address && address.length > 10) {
    formattedAddress = `${address.substring(0, 6)}...${address.substring(
      address.length - 4,
    )}`;
  }
  return formattedAddress?.toLowerCase();
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

/**
 * Format action subject, verb, tool to string.
 *
 * @param {Action} action Action.
 * @returns Formatted string with action name or "Unknown action";
 */
export function formatActionName(action) {
  if (action?.action) {
    return (
      capitalize(action.action.subject || '') +
      ' ' +
      (action.action.verb || '') +
      ' ' +
      (action.action.object || '')
    );
  }
  return 'Unknown action';
}
