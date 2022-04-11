/**
 * Class for the law (action with rules).
 *
 * @typedef {import('./Action.js').default} Action
 * @typedef {import('./Rule.js').default} Rule
 */
export default class Law {
  action;
  actionUriData;
  rules = [];

  /**
   * Law constructor.
   *
   * @param {Action} action Law action.
   * @param {object} actionUriData Law action uri data.
   */
  constructor(action, actionUriData) {
    this.action = action;
    this.actionUriData = actionUriData;
  }

  /**
   * Add rule and rule uri data to law.
   *
   * @param {Rule} rule Law rule.
   * @param {object} ruleUriData Law rule uri data.
   */
  addRule(rule, ruleUriData) {
    this.rules.push({
      rule: rule,
      ruleUriData: ruleUriData,
    });
  }
}
