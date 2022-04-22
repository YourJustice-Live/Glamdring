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
   * @param {number} stage Case stage.
   * @param {string} participantAccount Account that must be a participant in the case.
   * @param {number} first The number of cases to getting.
   * @param {number} skip The number of options to skip.
   * @returns {Promise.<Array.<Case>>} A list with cases.
   */
  let getCases = async function (
    jurisdiction,
    stage,
    participantAccount,
    first,
    skip,
  ) {
    const caseEntities = await findCaseEntities(
      jurisdiction,
      stage,
      participantAccount,
      first,
      skip,
    );
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
          caseEntity.verdictConfirmedRules,
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
