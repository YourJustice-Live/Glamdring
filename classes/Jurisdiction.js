/**
 * Class for the jurisdiction.
 */
export default class Jurisdiction {
  constructor(id, name, roles, rules, rulesCount, casesCount) {
    this.id = id;
    this.name = name;
    this.roles = roles;
    this.rules = rules;
    this.rulesCount = rulesCount;
    this.casesCount = casesCount;
  }
}
