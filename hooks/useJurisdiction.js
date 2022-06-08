import Jurisdiction from 'classes/Jurisdiction';
import JurisdictionRule from 'classes/JurisdictionRule';
import {
  FAKE_JURISDICTION_DESCRIPTION,
  FAKE_JURISDICTION_IMAGE,
} from 'constants/fakes';
import useJurisdictionContract from 'hooks/contracts/useJurisdictionContract';
import useSubgraph from 'hooks/useSubgraph';
import { hexStringToJson } from 'utils/converters';
import useErrors from './useErrors';
import useIpfs from './useIpfs';

/**
 * Hook for work with jurisdiction.
 */
export default function useJurisdiction() {
  const { handleError } = useErrors();
  const {
    findJurisdictionEntities,
    findJurisdictionEntitiesBySearchQuery,
    findJurisdictionRuleEntities,
    findJurisdictionRuleEntitiesBySearchQuery,
  } = useSubgraph();
  const { getUri } = useJurisdictionContract();
  const { loadJsonFromIPFS } = useIpfs();

  /**
   * Convert jurisdiction entity to jurisdiction object.
   *
   * @param {object} jurisdictionEntity Jurisdiction entity.
   * @returns Jurisdiction object.
   */
  async function createJurisdictionObject(jurisdictionEntity) {
    let jurisdictionUri;
    let jurisdictionImage;
    let jurisdictionDescription;
    // Use fake image and description for main jurisdiction contract
    if (
      jurisdictionEntity.id?.toLowerCase() ===
      process.env.NEXT_PUBLIC_MAIN_JURISDICTION_CONTRACT_ADDRESS?.toLowerCase()
    ) {
      jurisdictionImage = FAKE_JURISDICTION_IMAGE;
      jurisdictionDescription = FAKE_JURISDICTION_DESCRIPTION;
    }
    // Load image and description using jurisdiction uri
    else {
      try {
        jurisdictionUri = await getUri(jurisdictionEntity.id);
        const uriJson = await loadJsonFromIPFS(jurisdictionUri);
        jurisdictionImage = uriJson?.image;
        jurisdictionDescription = uriJson?.description;
      } catch (error) {
        handleError(error);
      }
    }
    // Return jurisdiction object
    return new Jurisdiction(
      jurisdictionEntity.id,
      jurisdictionUri,
      jurisdictionImage,
      jurisdictionEntity.name,
      jurisdictionDescription,
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
   * @param {string} params.member Account that must a member in the jurisdiction.
   * @param {string} params.judge Account that must a judge in the jurisdiction.
   * @param {string} params.admin Account that must an admin in the jurisdiction.
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
   * @returns {Promise.<Array.<{JurisdictionRule}>>} Array with rules.
   */
  let getJurisdictionRules = async function (
    ids,
    jurisdiction,
    actionGuid,
    isPositive,
    isNegative,
  ) {
    const jurisdictionRuleEntities = await findJurisdictionRuleEntities(
      ids,
      jurisdiction,
      actionGuid,
      isPositive,
      isNegative,
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
   * @param {string} searchQuery Search query.
   * @returns {Promise.<Array.<{JurisdictionRule}>>} Array with rules.
   */
  let getJurisdictionRulesBySearchQuery = async function (
    jurisdiction,
    isPositive,
    isNegative,
    searchQuery,
  ) {
    const jurisdictionRuleEntities =
      await findJurisdictionRuleEntitiesBySearchQuery(
        jurisdiction,
        isPositive,
        isNegative,
        searchQuery,
      );
    return jurisdictionRuleEntities.map((ruleEntity) =>
      createJurisdictionRuleObject(ruleEntity),
    );
  };

  /**
   * Get accounts for specified jurisdiction role.
   *
   * @param {Jurisdiction} jurisdiction Jurisdiction.
   * @param {string} role Role id.
   * @returns {Array.<string>} Array with accounts.
   */
  let getJurisdictionRoleAccounts = function (jurisdiction, role) {
    const jurisdictionRole = jurisdiction?.roles?.find(
      (element) => element?.roleId === role,
    );
    return jurisdictionRole?.accounts || [];
  };

  /**
   * Check that the account has a specified jurisdiction role.
   *
   * @param {Jurisdiction} jurisdiction Jurisdiction.
   * @param {string} account Account address.
   * @param {string} role Role id.
   * @returns {boolean} Result of checking.
   */
  let isAccountHasJurisdictionRole = function (jurisdiction, account, role) {
    const jurisdictionRole = jurisdiction?.roles?.find(
      (element) => element?.roleId === role,
    );
    return jurisdictionRole?.accounts?.includes(account?.toLowerCase());
  };

  return {
    getJurisdiction,
    getJurisdictions,
    getJurisdictionsBySearchQuery,
    getJurisdictionRule,
    getJurisdictionRules,
    getJurisdictionRulesBySearchQuery,
    getJurisdictionRoleAccounts,
    isAccountHasJurisdictionRole,
  };
}
