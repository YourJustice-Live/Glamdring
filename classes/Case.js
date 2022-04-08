/**
 * Class for the case.
 */
export default class Case {
  constructor(id, jurisdiction, rules, participants) {
    this.id = id;
    this.jurisdiction = jurisdiction;
    this.rules = rules;
    this.participants = participants;
  }
}
