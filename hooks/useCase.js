import Case from 'classes/Case';
import CaseEvent from 'classes/CaseEvent';
import { CASE_ROLE, CASE_STAGE } from 'constants/contracts';
import useSubgraph from 'hooks/useSubgraph';
import { hexStringToJson } from 'utils/converters';

/**
 * Hook for work with cases.
 */
export default function useCase() {
  const { findCaseEntities, findCaseEventEntities } = useSubgraph();

  /**
   * Get case.
   *
   * @param {string} id Case id (address).
   * @returns {Promise.<Case>} A case or null.
   */
  let getCase = async function (id) {
    const cases = await getCases({ ids: [id] });
    return cases && cases.length > 0 ? cases[0] : null;
  };

  /**
   * Get cases.
   *
   * @param {Object} params Params.
   * @param {Array.<string>} params.ids A list with case ids (addresses).
   * @param {string} params.searchQuery A part of case name for searching.
   * @param {Array.<string>} params.jurisdictions Jurisdiction ids (addresses).
   * @param {Array.<number>} stages A list with case stage ids.
   * @param {string} params.participant Id of token that must be a participant in the case.
   * @param {string} params.admin Id of token that must be an admin in the case.
   * @param {string} params.subject Id of token that must be a subject in the case.
   * @param {string} params.plaintiff Id of token that must be a plaintiff in the case.
   * @param {string} params.judge Id of token that must be a judge in the case.
   * @param {string} params.witness Id of token that must be a witness in the case.
   * @param {string} params.affected Id of token that must be an affected in the case.
   * @param {string} params.participanttWithoutConfirmationPost Id of token that must not have any post with confirmation.
   * @param {number} params.first The number of cases to getting.
   * @param {number} params.skip The number of options to skip.
   * @returns {Promise.<Array.<Case>>} A list with cases.
   */
  let getCases = async function ({
    ids,
    searchQuery,
    jurisdictions,
    stages,
    participant,
    admin,
    subject,
    plaintiff,
    judge,
    witness,
    affected,
    participanttWithoutConfirmationPost,
    first,
    skip,
  }) {
    const caseEntities = await findCaseEntities(
      ids,
      searchQuery,
      jurisdictions,
      stages,
      participant,
      admin,
      subject,
      plaintiff,
      judge,
      witness,
      affected,
      participanttWithoutConfirmationPost,
      first,
      skip,
    );
    let cases = [];
    for (const caseEntity of caseEntities) {
      const caseObject = new Case(
        caseEntity.id,
        caseEntity.name,
        caseEntity.createdDate,
        caseEntity.jurisdiction,
        caseEntity.stage,
        caseEntity.judgeAssignmentDate,
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
        caseEntity.nominates,
      );
      cases.push(caseObject);
    }
    return caseEntities;
  };

  /**
   * Find case events.
   *
   * @param {Array.<string>} caseIds Case ids.
   * @returns {Promise.<Array.<CaseEvent>>} A list with case events.
   */
  let getCaseEvents = async function (caseIds) {
    const caseEventEntities = await findCaseEventEntities(caseIds);
    let caseEvents = [];
    for (const caseEventEntity of caseEventEntities) {
      try {
        const caseEvent = new CaseEvent(
          caseEventEntity.id,
          caseEventEntity.caseEntity,
          caseEventEntity.createdDate,
          caseEventEntity.type,
          hexStringToJson(caseEventEntity.data),
        );
        caseEvents.push(caseEvent);
      } catch (error) {
        continue;
      }
    }
    return caseEvents;
  };

  /**
   * Check that the profile has any role in specified case.
   *
   * @param {Case} caseObject Case.
   * @param {string} profile Profile id.
   * @returns {boolean} Result of checking.
   */
  let isProfileHasAnyCaseRole = function (caseObject, profile) {
    return caseObject?.participants?.includes(profile);
  };

  /**
   * Check that the profile has a specified case role.
   *
   * @param {Case} caseObject Case.
   * @param {string} profile Profile id.
   * @param {string} role Role id.
   * @returns {boolean} Result of checking.
   */
  let isProfileHasCaseRole = function (caseObject, profile, role) {
    if (role === CASE_ROLE.admin.id) {
      return caseObject?.admins?.includes(profile);
    }
    if (role === CASE_ROLE.subject.id) {
      return caseObject?.subjects?.includes(profile);
    }
    if (role === CASE_ROLE.plaintiff.id) {
      return caseObject?.plaintiffs?.includes(profile);
    }
    if (role === CASE_ROLE.judge.id) {
      return caseObject?.judges?.includes(profile);
    }
    if (role === CASE_ROLE.witness.id) {
      return caseObject?.witnesses?.includes(profile);
    }
    if (role === CASE_ROLE.affected.id) {
      return caseObject?.affecteds?.includes(profile);
    }
    return false;
  };

  /**
   * Check that the profile has open cases created by him.
   *
   * @param {string} profile Profile id.
   * @returns {Promise.<boolean>} Result of checking.
   */
  let isProfileHasHasOpenCasesCreatedByHim = async function (profile) {
    const cases = await getCases({
      stages: [CASE_STAGE.open],
      admin: profile,
      first: 1,
    });
    return cases && cases.length > 0;
  };

  /**
   * Check that the profile has open cases where he is a subject.
   *
   * @param {string} profile Profile id.
   * @returns {Promise.<boolean>} Result of checking.
   */
  let isProfileHasHasOpenCasesAgainstHim = async function (profile) {
    const cases = await getCases({
      stages: [CASE_STAGE.open],
      subject: profile,
      first: 1,
    });
    return cases && cases.length > 0;
  };

  /**
   * Check that the profile has cases that await his confirmation.
   *
   * @param {string} profile Profile id.
   * @returns {Promise.<boolean>} Result of checking.
   */
  let isProfileHasAwaitingConfirmationCases = async function (profile) {
    const cases = await getCases({
      stages: [CASE_STAGE.open],
      witness: profile,
      participanttWithoutConfirmationPost: profile,
      first: 1,
    });
    return cases && cases.length > 0;
  };

  /**
   * Check that the profile has cases that await his judgment.
   *
   * @param {string} jurisdictions Ids (addresses) of jurisdictions where account is a judge.
   * @returns {Promise.<boolean>} Result of checking.
   */
  let isProfileHasAwaitingJudgingCases = async function (jurisdictions) {
    const cases = await getCases({
      stages: [CASE_STAGE.open, CASE_STAGE.verdict],
      jurisdictions: jurisdictions,
      first: 1,
    });
    return cases && cases.length > 0;
  };

  return {
    getCase,
    getCases,
    getCaseEvents,
    isProfileHasAnyCaseRole,
    isProfileHasCaseRole,
    isProfileHasHasOpenCasesCreatedByHim,
    isProfileHasHasOpenCasesAgainstHim,
    isProfileHasAwaitingConfirmationCases,
    isProfileHasAwaitingJudgingCases,
  };
}
