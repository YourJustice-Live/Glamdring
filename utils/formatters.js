/**
 * Convert "0x788a4fecc0ece997b9b64528bc9e10e0219c94a2" to "0x788...94a2".
 * 
 * @param {string} account Origin account.
 * @returns Formatted account.
 */
export function formatAccount(account) {
  if (account && account.length > 10) {
    return `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
  } else {
    return account;
  }
};