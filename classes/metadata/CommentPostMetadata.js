import { POST_TYPE } from 'constants/metadata';

/**
 * Class for metadata of comment post.
 */
export default class CommentPostMetadata {
  constructor(commentMessage) {
    this.type = POST_TYPE.comment;
    this.commentMessage = commentMessage;
  }
}
