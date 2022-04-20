/**
 * Class for the case.
 */
export default class Case {
  constructor(
    id,
    name,
    createdDate,
    jurisdiction,
    stage,
    verdictAuthor,
    verdictUri,
    verdictUriData,
    cancellationAuthor,
    cancellationUri,
    cancellationUriData,
    rules,
    roles,
    posts,
  ) {
    this.id = id;
    this.name = name;
    this.createdDate = createdDate;
    this.jurisdiction = jurisdiction;
    this.stage = stage;
    this.verdictAuthor = verdictAuthor;
    this.verdictUri = verdictUri;
    this.verdictUriData = verdictUriData;
    this.cancellationAuthor = cancellationAuthor;
    this.cancellationUri = cancellationUri;
    this.cancellationUriData = cancellationUriData;
    this.rules = rules;
    this.roles = roles;
    this.posts = posts;
  }
}
