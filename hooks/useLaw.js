import Law from 'classes/Law';
import useAction from 'hooks/useAction';
import useRule from 'hooks/useRule';
import useIpfs from './useIpfs';

/**
 * Hook for work with laws.
 */
export default function useLaw() {
  const { loadJsonFromIPFS } = useIpfs();
  const { getAction } = useAction();
  const { getRules } = useRule();

  /**
   * Get jurisdiction laws.
   *
   * @returns {Promise.<Map.<string,Law>>} A map with laws.
   */
  let getJurisdictionLaws = async function () {
    let laws = new Map();
    const rules = await getRules();
    for (const rule of rules) {
      try {
        // Find or create law by action (about)
        let law = laws.get(rule.rule.about);
        if (!law) {
          const action = await getAction(rule.rule.about);
          law = new Law(action, await loadJsonFromIPFS(action.uri));
        }
        // Add rule to law
        law.addRule(rule, await loadJsonFromIPFS(rule.rule.uri));
        // Update laws
        laws.set(rule.rule.about, law);
      } catch (error) {
        continue;
      }
    }
    return laws;
  };

  return {
    getJurisdictionLaws,
  };
}
