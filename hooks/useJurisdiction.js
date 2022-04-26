import Jurisdiction from 'classes/Jurisdiction';
import useSubgraph from 'hooks/useSubgraph';

/**
 * Hook for work with jurisdiction.
 */
export default function useJurisdiction() {
  const { findJurisdictionEntities } = useSubgraph();

  /**
   * Get a jurisdiction.
   *
   * @param {string} id Jurisdiction id (address).
   * @returns {Promise.<Jurisdiction>} A jurisdiction or null.
   */
  let getJurisdiction = async function (id) {
    const jurisdictionEntities = await findJurisdictionEntities([id]);
    if (!jurisdictionEntities || jurisdictionEntities.length === 0) {
      return null;
    }
    const jurisdictionEntity = jurisdictionEntities[0];
    const jurisdiction = new Jurisdiction(
      jurisdictionEntity.id,
      jurisdictionEntity.roles,
      jurisdictionEntity.rules,
    );
    return jurisdiction;
  };

  return {
    getJurisdiction,
  };
}
