/**
 * Class for the case.
 */
export default class Case {
  constructor(id, jurisdiction, stage, verdictUri, rules, roles, posts) {
    this.id = id;
    this.jurisdiction = jurisdiction;
    this.stage = stage;
    this.verdictUri = verdictUri;
    this.rules = rules;
    this.roles = roles;
    this.posts = posts;
  }
}
