import Case from 'classes/Case';
import useSubgraph from 'hooks/useSubgraph';

/**
 * Hook for work with cases.
 */
export default function useCase() {
  const { findCaseEntities } = useSubgraph();

  /**
   * Get cases.
   *
   * @param {string} jurisdiction Jurisdiction address.
   * @returns {Promise.<Array.<Case>>} A list with cases.
   */
  let getCases = async function (jurisdiction) {
    const caseEntities = await findCaseEntities(jurisdiction);
    let cases = [];
    for (const caseEntity of caseEntities) {
      try {
        const caseObject = new Case(
          caseEntity.id,
          caseEntity.name,
          caseEntity.createdDate,
          caseEntity.jurisdiction,
          caseEntity.stage,
          caseEntity.verdictAuthor,
          caseEntity.verdictUri,
          caseEntity.verdictUriData,
          caseEntity.cancellationAuthor,
          caseEntity.cancellationUri,
          caseEntity.cancellationUriData,
          caseEntity.rules,
          caseEntity.roles,
          caseEntity.posts,
        );
        cases.push(caseObject);
      } catch (error) {
        continue;
      }
    }
    return caseEntities;
  };

  return {
    getCases,
  };
}
