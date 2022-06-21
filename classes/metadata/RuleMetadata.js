/**
 * Class for metadata of rule.
 */
export default class RuleMetadata {
  constructor(name, description, evidenceDescription) {
    this.name = name;
    this.description = description;
    this.evidenceDescription = evidenceDescription;
  }
}
