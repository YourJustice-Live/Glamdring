/**
 * Class for the case.
 */
export default class Case {
  constructor(id, jurisdiction, stage, verdictUri, rules, participants, posts) {
    this.id = id;
    this.jurisdiction = jurisdiction;
    this.stage = stage;
    this.verdictUri = verdictUri;
    this.rules = rules;
    this.participants = participants;
    this.posts = posts;
  }
}
