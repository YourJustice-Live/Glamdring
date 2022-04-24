import Law from 'classes/Law';
import useAction from 'hooks/useAction';
import useRule from 'hooks/useRule';

/**
 * Hook for work with laws.
 *
 * @typedef {import('../classes/Rule').default} Rule
 */
export default function useLaw() {
  const { getAction } = useAction();
  const { getRules } = useRule();

  /**
   * Get laws by specified rules.
   *
   * @param {Array.<Rule>} rules Rules.
   * @returns {Promise.<Map.<string,Law>>} A map with laws.
   */
  let getLawsByRules = async function (rules) {
    let laws = new Map();
    for (const rule of rules) {
      try {
        // Find or create law by action (about)
        let law = laws.get(rule.rule.about);
        if (!law) {
          const action = await getAction(rule.rule.about);
          law = new Law(action);
        }
        // Add rule to law
        law.addRule(rule);
        // Update laws
        laws.set(rule.rule.about, law);
      } catch (error) {
        continue;
      }
    }
    return laws;
  };

  /**
   * Get jurisdiction laws.
   *
   * @returns {Promise.<Map.<string,Law>>} A map with laws.
   */
  let getJurisdictionLaws = async function () {
    const rules = await getRules();
    const laws = await getLawsByRules(rules);
    return laws;
  };

  return {
    getLawsByRules,
    getJurisdictionLaws,
  };
}
