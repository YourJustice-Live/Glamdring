import useIpfs from 'hooks/useIpfs';
import useSubgraph from 'hooks/useSubgraph';
import Rule from 'objects/Rule';

/**
 * Hook for work with rules.
 */
export default function useRule() {
  const { findJurisdictionRuleEntities } = useSubgraph();
  const { loadJsonFromIPFS } = useIpfs();

  /**
   * Get rules.
   *
   * @param {string} actionGuid If not null, then the function returns the rules for the specified action.
   * @returns {Promise.<Array.<Rule>>} A list with rules.
   */
  let getRules = async function (actionGuid) {
    const ruleEntities = await findJurisdictionRuleEntities(actionGuid);
    let rules = [];
    for (const ruleEntity of ruleEntities) {
      try {
        const rule = new Rule(
          ruleEntity.id,
          ruleEntity.about.id,
          ruleEntity.affected,
          ruleEntity.negation,
          ruleEntity.uri,
          await loadJsonFromIPFS(ruleEntity.uri),
          ruleEntity.effectsEnvironmental,
          ruleEntity.effectsProfessional,
          ruleEntity.effectsSocial,
          ruleEntity.effectsPersonal,
          ruleEntity.confirmationRuling,
          ruleEntity.confirmationEvidence,
          ruleEntity.confirmationWitness,
        );
        rules.push(rule);
      } catch (error) {
        continue;
      }
    }
    return rules;
  };

  return {
    getRules,
  };
}
