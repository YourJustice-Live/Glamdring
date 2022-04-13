/**
 * Convert hex string to json.
 *
 * @param {string} hexString Hex string.
 * @returns {object} JSON.
 */
export function hexStringToJson(hexString) {
  var hex = hexString.toString();
  if (hex.startsWith('0x')) {
    hex = hex.substring(2);
  }
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substring(n, n + 2), 16));
  }
  return JSON.parse(str);
}