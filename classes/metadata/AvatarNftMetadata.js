import { resolveLink } from 'utils/ipfs';

/**
 * Class for metadata of avatar nft.
 */
export default class AvatarNftMetadata {
  constructor(image, attributes) {
    this.image = resolveLink(image);
    this.attributes = attributes;
  }
}
