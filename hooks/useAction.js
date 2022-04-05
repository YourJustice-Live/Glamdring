import useIpfs from 'hooks/useIpfs';
import useSubgraph from 'hooks/useSubgraph';
import Action from 'classes/Action';

/**
 * Hook for work with actions.
 */
export default function useAction() {
  const { findActionEntities } = useSubgraph();
  const { loadJsonFromIPFS } = useIpfs();

  /**
   * Get actions.
   *
   * @returns {Promise.<Array.<Action>>} A list with actions.
   */
  let getActions = async function () {
    const actionEntities = await findActionEntities();
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
          await loadJsonFromIPFS(actionEntity.uri),
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
  };
}
