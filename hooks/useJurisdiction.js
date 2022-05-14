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
  const { findJurisdictionEntities, findJurisdictionRuleEntities } =
    useSubgraph();
  const { getUri } = useJurisdictionContract();
  const { loadJsonFromIPFS } = useIpfs();

  /**
   * Convert jurisdiction entity to jurisdiction object.
   *
   * @param {object} jurisdictionEntity Jurisdiction entity.
   * @returns Jurisdiction object.
   */
  async function createJurisdictionObject(jurisdictionEntity) {
    let jurisdictionImage;
    let jurisdictionDescription;
    // Use fake image and description for main jurisdiction contract
    if (
      jurisdictionEntity.id?.toLowerCase() ===
      process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS?.toLowerCase()
    ) {
      jurisdictionImage = FAKE_JURISDICTION_IMAGE;
      jurisdictionDescription = FAKE_JURISDICTION_DESCRIPTION;
    }
    // Load image and description using jurisdiction uri
    else {
      try {
        const uri = await getUri(jurisdictionEntity.id);
        const uriJson = await loadJsonFromIPFS(uri);
        jurisdictionImage = uriJson?.image;
        jurisdictionDescription = uriJson?.description;
      } catch (error) {
        console.error(error);
      }
    }
    // Return jurisdiction object
    return new Jurisdiction(
      jurisdictionEntity.id,
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
   * Get jurisdiction rules.
   *
   * @param {Array.<string>} ids A list with jurisdiction rule ids.
   * @param {string} jurisdiction Jurisdiction id (address).
   * @param {string} actionGuid Action id (guid).
   * @returns {Promise.<Array.<{JurisdictionRule}>>} Array with rule entities.
   */
  let getJusirsdictionRules = async function (ids, jurisdiction, actionGuid) {
    const jurisdictionRuleEntities = await findJurisdictionRuleEntities(
      ids,
      jurisdiction,
      actionGuid,
    );
    return jurisdictionRuleEntities.map(
      (ruleEntity) =>
        new JurisdictionRule(
          ruleEntity.id,
          ruleEntity.ruleId,
          ruleEntity.about.id,
          ruleEntity.affected,
          ruleEntity.negation,
          ruleEntity.uri,
          hexStringToJson(ruleEntity.uriData),
          ruleEntity.confirmationRuling,
          ruleEntity.confirmationEvidence,
          ruleEntity.confirmationWitness,
          ruleEntity.effects,
        ),
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
    getJusirsdictionRules,
    getJurisdictionRoleAccounts,
    isJurisdictionRuleInCategory,
    isAccountHasJurisdictionRole,
  };
}
