import { resolveLink } from 'utils/ipfs';

/**
 * Class for metadata of jurisdiction.
 */
export default class JurisdictionMetadata {
  constructor(image, description) {
    this.image = resolveLink(image);
    this.description = description;
  }
}
