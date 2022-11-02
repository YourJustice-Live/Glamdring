import { resolveLink } from 'utils/ipfs';

/**
 * Class for the jurisdiction.
 */
export default class Jurisdiction {
  constructor(id, name, uri, uriData, roles, rules, rulesCount, casesCount) {
    this.id = id;
    this.name = name;
    this.uri = uri;
    this.uriData = uriData;
    this.uriData.image = resolveLink(uriData.image);
    this.roles = roles;
    this.rules = rules;
    this.rulesCount = rulesCount;
    this.casesCount = casesCount;
  }
}
