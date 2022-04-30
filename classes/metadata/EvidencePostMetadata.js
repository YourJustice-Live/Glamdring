import { POST_TYPE } from 'constants/metadata';

/**
 * Class for metadata of evidence post.
 */
export default class EvidencePostMetadata {
  constructor(title, fileUri, fileName, fileType) {
    this.type = POST_TYPE.evidence;
    this.evidenceTitle = title;
    this.evidenceFileUri = fileUri;
    this.evidenceFileName = fileName;
    this.evidenceFileType = fileType;
  }
}
