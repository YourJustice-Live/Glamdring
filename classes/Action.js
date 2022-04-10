/**
 * Class for the action.
 */
export default class Action {
  constructor(guid, actionSubject, actionVerb, actionObject, actionTool, uri) {
    this.guid = guid;
    this.action = {
      subject: actionSubject,
      verb: actionVerb,
      object: actionObject,
      tool: actionTool,
    };
    this.uri = uri;
  }
}
