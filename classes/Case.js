/**
 * Class for the case.
 */
export default class Case {
  constructor(
    id,
    createdDate,
    jurisdiction,
    stage,
    verdictUri,
    rules,
    roles,
    posts,
  ) {
    this.id = id;
    this.createdDate = createdDate;
    this.jurisdiction = jurisdiction;
    this.stage = stage;
    this.verdictUri = verdictUri;
    this.rules = rules;
    this.roles = roles;
    this.posts = posts;
  }
}
