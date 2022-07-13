import { ICON } from 'constants/metadata';

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

/**
 * Get a icon component by rule metadata.
 *
 * @param {Rule} action Rule.
 * @param {number} size Width and height of icon.
 * @returns Icon Component.
 */
export function getRuleIcon(rule, size = 36) {
  const icon = Object.values(ICON).find(
    (icon) => icon.name === rule?.rule?.uriData?.icon,
  );
  return icon?.icon(size) || ICON.default.icon(size);
}
