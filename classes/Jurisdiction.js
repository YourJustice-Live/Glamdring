/**
 * Class for the jurisdiction.
 */
export default class Jurisdiction {
  constructor(
    id,
    uri,
    image,
    name,
    description,
    roles,
    rules,
    rulesCount,
    casesCount,
  ) {
    this.id = id;
    this.uri = uri;
    this.image = image;
    this.name = name;
    this.description = description;
    this.roles = roles;
    this.rules = rules;
    this.rulesCount = rulesCount;
    this.casesCount = casesCount;
  }
}
