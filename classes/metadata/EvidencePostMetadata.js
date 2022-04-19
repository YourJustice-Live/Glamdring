/**
 * Class for metadata of evidence post.
 */
export default class EvidencePostMetadata {
  constructor(title, fileUri, fileName, fileType) {
    this.type = 'evidence';
    this.evidenceTitle = title;
    this.evidenceFileUri = fileUri;
    this.evidenceFileName = fileName;
    this.evidenceFileType = fileType;
  }
}
