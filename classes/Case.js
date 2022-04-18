/**
 * Class for the case.
 */
export default class Case {
  constructor(
    id,
    name,
    createdDate,
    jurisdiction,
    stage,
    verdictUri,
    rules,
    roles,
    posts,
  ) {
    this.id = id;
    this.name = name;
    this.createdDate = createdDate;
    this.jurisdiction = jurisdiction;
    this.stage = stage;
    this.verdictUri = verdictUri;
    this.rules = rules;
    this.roles = roles;
    this.posts = posts;
  }
}
