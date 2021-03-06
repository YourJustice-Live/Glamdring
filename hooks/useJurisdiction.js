import Jurisdiction from 'classes/Jurisdiction';
import JurisdictionRule from 'classes/JurisdictionRule';
import useSubgraph from 'hooks/useSubgraph';
import { hexStringToJson } from 'utils/converters';

/**
 * Hook for work with jurisdiction.
 */
export default function useJurisdiction() {
  const {
    findJurisdictionEntities,
    findJurisdictionEntitiesBySearchQuery,
    findJurisdictionRuleEntities,
    findJurisdictionRuleEntitiesBySearchQuery,
  } = useSubgraph();

  /**
   * Convert jurisdiction entity to jurisdiction object.
   *
   * @param {object} jurisdictionEntity Jurisdiction entity.
   * @returns Jurisdiction object.
   */
  async function createJurisdictionObject(jurisdictionEntity) {
    // Return jurisdiction object
    return new Jurisdiction(
      jurisdictionEntity.id,
      jurisdictionEntity.name,
      jurisdictionEntity.uri,
      hexStringToJson(jurisdictionEntity.uriData),
      jurisdictionEntity.roles,
      jurisdictionEntity.rules,
      jurisdictionEntity.rulesCount,
      jurisdictionEntity.casesCount,
    );
  }

  /**
   * Convert jurisdiction rule entity to object.
   *
   * @param {object} jurisdictionRuleEntity Jurisdiction rule entity.
   * @returns Jurisdiction rule object.
   */
  function createJurisdictionRuleObject(jurisdictionRuleEntity) {
    return new JurisdictionRule(
      jurisdictionRuleEntity.id,
      jurisdictionRuleEntity.ruleId,
      jurisdictionRuleEntity.about.id,
      jurisdictionRuleEntity.affected,
      jurisdictionRuleEntity.negation,
      jurisdictionRuleEntity.uri,
      hexStringToJson(jurisdictionRuleEntity.uriData),
      jurisdictionRuleEntity.confirmationRuling,
      jurisdictionRuleEntity.confirmationEvidence,
      jurisdictionRuleEntity.confirmationWitness,
      jurisdictionRuleEntity.effects,
      jurisdictionRuleEntity.isPositive,
      jurisdictionRuleEntity.isDisabled,
    );
  }

  /**
   * Get jurisdiction for specified id.
   *
   * @param {string} id Jurisdiction id (address).
   * @returns {Promise.<Jurisdiction>} A jurisdiction or null.
   */
  let getJurisdiction = async function (id) {
    const jurisdictions = await getJurisdictions({ ids: [id] });
    return jurisdictions && jurisdictions.length > 0 ? jurisdictions[0] : null;
  };

  /**
   * Get jurisdictions.
   *
   * @param {Object} params Params.
   * @param {Array.<string>} params.ids Jurisdction ids (addresses). May be null for get all jurisdictions.
   * @param {string} params.searchQuery A part of jurisdiction name for searching.
   * @param {string} params.member Profile token id that must a member in the jurisdiction.
   * @param {string} params.judge Profile token id that must a judge in the jurisdiction.
   * @param {string} params.admin Profile token id that must an admin in the jurisdiction.
   * @param {number} params.first The number of jurisdictions to getting.
   * @param {number} params.skip The number of jurisdictions to skip.
   * @returns {Promise.<Array.<Jurisdiction>>} Jurisdiction objects.
   */
  let getJurisdictions = async function ({
    ids,
    searchQuery,
    member,
    judge,
    admin,
    first,
    skip,
  }) {
    const jurisdictions = [];
    const jurisdictionEntities = await findJurisdictionEntities(
      ids,
      searchQuery,
      member,
      judge,
      admin,
      first,
      skip,
    );
    for (const jurisdictionEntity of jurisdictionEntities) {
      jurisdictions.push(await createJurisdictionObject(jurisdictionEntity));
    }
    return jurisdictions;
  };

  /**
   * Get jurisdictions by part of address or name.
   *
   * @param {string} searchQuery Search query.
   * @returns {Promise.<Array.<Jurisdiction>>} A list with jurisdictions.
   */
  let getJurisdictionsBySearchQuery = async function (searchQuery) {
    const jurisdictions = [];
    const jurisdictionEntities = await findJurisdictionEntitiesBySearchQuery(
      searchQuery,
    );
    for (const jurisdictionEntity of jurisdictionEntities) {
      jurisdictions.push(await createJurisdictionObject(jurisdictionEntity));
    }
    return jurisdictions;
  };

  /**
   * Get jurisdiction rule.
   *
   * @param {string} jurisdiction Jurisdiction id (address).
   * @param {string} ruleId Rule id.
   * @returns {Promise.<JurisdictionRule>} A jurisdiction rule or null.
   */
  let getJurisdictionRule = async function (jurisdiction, ruleId) {
    const rules = await getJurisdictionRules([`${jurisdiction}_${ruleId}`]);
    return rules && rules.length > 0 ? rules[0] : null;
  };

  /**
   * Get jurisdiction rules.
   *
   * @param {Array.<string>} ids A list with jurisdiction rule ids.
   * @param {string} jurisdiction Jurisdiction id (address).
   * @param {string} actionGuid Action id (guid).
   * @param {bool} isPositive If required to get only positive rules.
   * @param {bool} isNegative If required to get only negative rules.
   * @param {bool} isEnabled If required to get only enabled rules.
   * @returns {Promise.<Array.<{JurisdictionRule}>>} Array with rules.
   */
  let getJurisdictionRules = async function (
    ids,
    jurisdiction,
    actionGuid,
    isPositive,
    isNegative,
    isEnabled,
  ) {
    const jurisdictionRuleEntities = await findJurisdictionRuleEntities(
      ids,
      jurisdiction,
      actionGuid,
      isPositive,
      isNegative,
      isEnabled,
    );
    return jurisdictionRuleEntities.map((ruleEntity) =>
      createJurisdictionRuleObject(ruleEntity),
    );
  };

  /**
   * Get jurisdiction rules by search query (search by action name, action subject, rule affected).
   *
   * @param {string} jurisdiction Jurisdiction id (address).
   * @param {bool} isPositive If required to get only positive rules.
   * @param {bool} isNegative If required to get only negative rules.
   * @param {bool} isEnabled If required to get only enabled rules.
   * @param {string} searchQuery Search query.
   * @returns {Promise.<Array.<{JurisdictionRule}>>} Array with rules.
   */
  let getJurisdictionRulesBySearchQuery = async function (
    jurisdiction,
    isPositive,
    isNegative,
    isEnabled,
    searchQuery,
  ) {
    const jurisdictionRuleEntities =
      await findJurisdictionRuleEntitiesBySearchQuery(
        jurisdiction,
        isPositive,
        isNegative,
        isEnabled,
        searchQuery,
      );
    return jurisdictionRuleEntities.map((ruleEntity) =>
      createJurisdictionRuleObject(ruleEntity),
    );
  };

  /**
   * Get participants (profile token ids) for specified jurisdiction role.
   *
   * @param {Jurisdiction} jurisdiction Jurisdiction.
   * @param {string} role Role id.
   * @returns {Array.<string>} Array with participants (profile token ids).
   */
  let getJurisdictionRoleParticipants = function (jurisdiction, role) {
    const jurisdictionRole = jurisdiction?.roles?.find(
      (element) => element?.roleId === role,
    );
    return jurisdictionRole?.participants || [];
  };

  /**
   * Check that the profile has a specified jurisdiction role.
   *
   * @param {Jurisdiction} jurisdiction Jurisdiction.
   * @param {string} profile Profile id.
   * @param {string} role Role id.
   * @returns {boolean} Result of checking.
   */
  let isProfileHasJurisdictionRole = function (jurisdiction, profile, role) {
    const jurisdictionRole = jurisdiction?.roles?.find(
      (element) => element?.roleId === role,
    );
    return jurisdictionRole?.participants?.includes(profile);
  };

  return {
    getJurisdiction,
    getJurisdictions,
    getJurisdictionsBySearchQuery,
    getJurisdictionRule,
    getJurisdictionRules,
    getJurisdictionRulesBySearchQuery,
    getJurisdictionRoleParticipants,
    isProfileHasJurisdictionRole,
  };
}
