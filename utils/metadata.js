export const traitTypes = {
  firstName: "First Name",
  lastName: "Last Name",
  email: "Email",
  twitter: "Twitter",
}

/**
 * Get a trait value from attributes of specified metadata.
 * 
 * @param {object} metadata Specified metadata.
 * @param {string} traitType Type of trait.
 * @returns Value of trait.
 */
export function getTraitValue(metadata, traitType) {
  return metadata?.attributes?.find(attribute => attribute?.trait_type === traitType)?.value || null;
};