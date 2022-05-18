import Law from 'classes/Law';
import useAction from 'hooks/useAction';
import useJurisdiction from 'hooks/useJurisdiction';

/**
 * Hook for work with laws.
 *
 * @typedef {import('../classes/JurisdictionRule').JurisdictionRule} Rule
 */
export default function useLaw() {
  const { getActions } = useAction();
  const { getJurisdictionRules } = useJurisdiction();

  /**
   * Get laws by specified rules.
   *
   * @param {Array.<Rule>} rules Rules.
   * @returns {Promise.<Map.<string,Law>>} A map with laws, where key is action guid.
   */
  let getLawsByRules = async function (rules) {
    let laws = new Map();
    const actionGuids = new Set();
    for (const rule of rules) {
      actionGuids.add(rule.rule.about);
    }
    const actions = await getActions(Array.from(actionGuids));
    for (const rule of rules) {
      try {
        // Find or create law by action (about)
        let law = laws.get(rule.rule.about);
        if (!law) {
          const action = actions.find(
            (action) => action.guid === rule.rule.about,
          );
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
   * Get laws by specified jurisdiction.
   *
   * @param {string} jurisdiction Jurisdiction id (address).
   * @returns {Promise.<Map.<string,Law>>} A map with laws.
   */
  // eslint-disable-next-line no-unused-vars
  let getLawsByJurisdiction = async function (jurisdiction) {
    const rules = await getJurisdictionRules(null, jurisdiction, null);
    const laws = await getLawsByRules(rules);
    return laws;
  };

  /**
   * Checking that the law has only positive rules.
   *
   * @param {Map.<string,Law>} laws A map with laws, where key is action guid.
   * @returns Boolean.
   */
  let isLawsPositive = function (laws) {
    for (const law of laws?.values() || []) {
      for (const rule of law?.rules || []) {
        if (!rule.isPositive) {
          return false;
        }
      }
    }
    return true;
  };

  return {
    getLawsByRules,
    getLawsByJurisdiction,
    isLawsPositive,
  };
}
