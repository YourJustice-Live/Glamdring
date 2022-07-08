/**
 * Class for metadata of rule.
 */
export default class RuleMetadata {
  constructor(name, description, icon, evidenceDescription) {
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.evidenceDescription = evidenceDescription;
  }
}
