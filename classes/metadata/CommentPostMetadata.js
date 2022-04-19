/**
 * Class for metadata of comment post.
 */
export default class CommentPostMetadata {
  constructor(commentMessage) {
    this.type = 'comment';
    this.commentMessage = commentMessage;
  }
}
