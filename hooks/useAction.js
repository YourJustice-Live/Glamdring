import Action from 'classes/Action';
import useSubgraph from 'hooks/useSubgraph';
import { hexStringToJson } from 'utils/converters';

/**
 * Hook for work with actions.
 */
export default function useAction() {
  const { findActionEntities } = useSubgraph();

  /**
   * Get action for specified guid.
   *
   * @returns {Promise.<Action>} A action or null if action not found.
   */
  let getAction = async function (guid) {
    return (await getActions([guid]))[0];
  };

  /**
   * Get actions.
   *
   * @param {Array.<string>} guids If not null, then the function returns the actions for the specified guids.
   * @returns {Promise.<Array.<Action>>} A list with actions.
   */
  let getActions = async function (guids) {
    const actionEntities = await findActionEntities(guids);
    let actions = [];
    for (const actionEntity of actionEntities) {
      try {
        const action = new Action(
          actionEntity.id,
          actionEntity.subject,
          actionEntity.verb,
          actionEntity.object,
          actionEntity.tool,
          actionEntity.uri,
          hexStringToJson(actionEntity.uriData),
        );
        actions.push(action);
      } catch (error) {
        continue;
      }
    }
    return actions;
  };

  return {
    getActions,
    getAction,
  };
}
