import { POST_TYPE } from 'constants/metadata';

/**
 * Class for metadata of confirmation post.
 */
export default class ConfirmationPostMetadata {
  constructor(confirmationType, confirmationMessage) {
    this.type = POST_TYPE.confirmation;
    this.confirmationType = confirmationType;
    this.confirmationMessage = confirmationMessage;
  }
}
