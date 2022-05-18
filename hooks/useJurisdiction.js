import Jurisdiction from 'classes/Jurisdiction';
import JurisdictionRule from 'classes/JurisdictionRule';
import useSubgraph from 'hooks/useSubgraph';
import useJurisdictionContract from 'hooks/contracts/useJurisdictionContract';
import { hexStringToJson } from 'utils/converters';
import { REPUTATION_RATING } from 'constants/contracts';
import {
  FAKE_JURISDICTION_DESCRIPTION,
  FAKE_JURISDICTION_IMAGE,
} from 'constants/fakes';
import useIpfs from './useIpfs';

/**
 * Hook for work with jurisdiction.
 */
export default function useJurisdiction() {
  const {
    findJurisdictionEntities,
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
        console.error(error);
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
    );
  }

  /**
   * Get jurisdiction for specified id.
   *
   * @param {string} id Jurisdiction id (address).
   * @returns {Promise.<Jurisdiction>} A jurisdiction or null.
   */
  let getJurisdiction = async function (id) {
    const jurisdictions = await getJurisdictions([id]);
    return jurisdictions && jurisdictions.length > 0 ? jurisdictions[0] : null;
  };

  /**
   * Get jurisdictions.
   *
   * @param {Array.<string>} ids Jurisdction ids (addresses). May be null for get all jurisdictions.
   * @param {number} first The number of jurisdictions to getting.
   * @param {number} skip The number of jurisdictions to skip.
   * @returns {Promise.<Array.<Jurisdiction>>} Jurisdiction entitites.
   */
  let getJurisdictions = async function (ids, first, skip) {
    const jurisdictions = [];
    const jurisdictionEntities = await findJurisdictionEntities(
      ids,
      first,
      skip,
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
   * Checking that the jurisdiction rule is in a category.
   *
   * TODO: Replace to function "isJurisdictionRulePositive()"
   *
   * @param {JurisdictionRule} rule Jurisdiction rule.
   * @param {'positive'|'negative'} category Category.
   * @returns {boolean} Result of checking.
   */
  let isJurisdictionRuleInCategory = function (rule, category) {
    if (rule?.effects && category === 'positive') {
      let isRulePositive = true;
      for (const effect of rule.effects) {
        if (effect.direction != REPUTATION_RATING.positive.direction) {
          isRulePositive = false;
        }
      }
      return isRulePositive;
    } else if (rule?.effects && category === 'negative') {
      return !isJurisdictionRuleInCategory(rule, 'positive');
    } else {
      return false;
    }
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
    getJurisdictionRule,
    getJurisdictionRules,
    getJurisdictionRulesBySearchQuery,
    getJurisdictionRoleAccounts,
    isJurisdictionRuleInCategory,
    isAccountHasJurisdictionRole,
  };
}
