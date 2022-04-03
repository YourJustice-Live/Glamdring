/**
 * Function that returns action object.
 */
export default function Action(
  guid,
  actionSubject,
  actionVerb,
  actionObject,
  actionTool,
  uri,
  uriData,
) {
  return {
    guid: guid,
    action: {
      subject: actionSubject,
      verb: actionVerb,
      object: actionObject,
      tool: actionTool,
    },
    uri: uri,
    uriData: uriData,
  };
}
