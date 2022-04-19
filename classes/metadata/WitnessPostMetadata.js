/**
 * Class for metadata of witness post.
 */
export default class EvidencePostMetadata {
  constructor(witnessMessage) {
    this.type = 'witness';
    this.witnessMessage = witnessMessage;
  }
}
