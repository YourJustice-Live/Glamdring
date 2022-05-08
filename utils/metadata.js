/**
 * Get a trait value from metadata attributes.
 *
 * @param {Array.<object>} attributes Metadata attributes.
 * @param {string} traitType Type of trait.
 * @returns Value of trait.
 */
export function getTraitValue(attributes, traitType) {
  const attribute = attributes?.find(
    (attribute) => attribute?.trait_type === traitType,
  );
  return attribute?.value || null;
}
