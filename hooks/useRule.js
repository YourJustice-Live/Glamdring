import Rule from 'classes/Rule';
import useSubgraph from 'hooks/useSubgraph';

/**
 * Hook for work with rules.
 */
export default function useRule() {
  const {
    findJurisdictionRuleEntities,
    findJurisdictionRuleEntitiesByIds,
    findJurisdictionRuleEntitiesByActionGuid,
  } = useSubgraph();

  /**
   * Get jurisdiction rules.
   *
   * @returns {Promise.<Array.<Rule>>} A list with rules.
   */
  let getRules = async function () {
    const ruleEntities = await findJurisdictionRuleEntities();
    return ruleEntities.map((ruleEntity) => createRuleObject(ruleEntity));
  };

  /**
   * Get jurisdiction rule by id.
   *
   * @param {string} id Rule id.
   * @returns {Promise<Rule>} A rule.
   */
  let getRuleById = async function (id) {
    return (await getRulesByIds([id]))[0];
  };

  /**
   * Get jurisdiction rules by ids.
   *
   * @param {Array.<string>} ids Rule ids.
   * @returns {Promise.<Array.<Rule>>} A list with rules.
   */
  let getRulesByIds = async function (ids) {
    const ruleEntities = await findJurisdictionRuleEntitiesByIds(ids);
    return ruleEntities.map((ruleEntity) => createRuleObject(ruleEntity));
  };

  /**
   * Get jurisdiction rules by specified action guid.
   *
   * @param {string} actionGuid If not null, then the function returns the rules for the specified action.
   * @returns {Promise.<Array.<Rule>>} A list with rules.
   */
  let getRulesByActionGuid = async function (actionGuid) {
    const ruleEntities = await findJurisdictionRuleEntitiesByActionGuid(
      actionGuid,
    );
    return ruleEntities.map((ruleEntity) => createRuleObject(ruleEntity));
  };

  /**
   * Checking that the rule is in a category.
   *
   * @param {Rule} rule Rule.
   * @param {'positive'|'negative'} category Category.
   * @returns {boolean} Result of checking.
   */
  let isRuleInCategory = function (rule, category) {
    if (category === 'positive') {
      return (
        rule?.rule?.effects?.environmental >= 0 &&
        rule?.rule?.effects?.professional >= 0 &&
        rule?.rule?.effects?.social >= 0 &&
        rule?.rule?.effects?.personal >= 0
      );
    }
    if (category === 'negative') {
      return (
        rule?.rule?.effects?.environmental < 0 ||
        rule?.rule?.effects?.professional < 0 ||
        rule?.rule?.effects?.social < 0 ||
        rule?.rule?.effects?.personal < 0
      );
    }
  };

  return {
    getRules,
    getRuleById,
    getRulesByIds,
    getRulesByActionGuid,
    isRuleInCategory,
  };
}

/**
 * Convert rule entity to rule object.
 *
 * @param {object} ruleEntity Rule entity.
 * @returns Rule object.
 */
function createRuleObject(ruleEntity) {
  return new Rule(
    ruleEntity.id,
    ruleEntity.about.id,
    ruleEntity.affected,
    ruleEntity.negation,
    ruleEntity.uri,
    ruleEntity.effectsEnvironmental,
    ruleEntity.effectsProfessional,
    ruleEntity.effectsSocial,
    ruleEntity.effectsPersonal,
    ruleEntity.confirmationRuling,
    ruleEntity.confirmationEvidence,
    ruleEntity.confirmationWitness,
  );
}
