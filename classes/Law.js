/**
 * Class for the law (action with rules).
 *
 * @typedef {import('./Action.js').default} Action
 * @typedef {import('./Rule.js').default} Rule
 */
export default class Law {
  action;
  rules = [];

  /**
   * Law constructor.
   *
   * @param {Action} action Law action.
   */
  constructor(action) {
    this.action = action;
  }

  /**
   * Add rule.
   *
   * @param {Rule} rule Law rule.
   */
  addRule(rule) {
    this.rules.push(rule);
  }
}
