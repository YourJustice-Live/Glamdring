import { handleCatchErrorEvent } from './analytics';

/**
 * Convert hex string to json.
 *
 * Source - https://stackoverflow.com/a/60505243.
 *
 * @param {string} hexString Hex string.
 * @returns {object} JSON or null.
 */
export function hexStringToJson(hexString) {
  if (!hexString || hexString.length === 0) {
    return null;
  }
  try {
    var hex = hexString.toString();
    if (hex.startsWith('0x')) {
      hex = hex.substring(2);
    }
    var str = decodeURIComponent(
      hex.replace(/\s+/g, '').replace(/[0-9a-f]{2}/g, '%$&'),
    );
    return JSON.parse(str);
  } catch (error) {
    console.error(error);
    handleCatchErrorEvent(error);
    return null;
  }
}
