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
   * @param {number} params.stage Case stage id.
   * @param {string} params.participant Account that must a participant in the case.
   * @param {string} params.admin Account that must an admin in the case.
   * @param {string} params.subject Account that must a subject in the case.
   * @param {string} params.plaintiff Account that must a plaintiff in the case.
   * @param {string} params.judge Account that must a judge in the case.
   * @param {string} params.witness Account that must a witness in the case.
   * @param {string} params.affected Account that must an affected in the case.
   * @param {string} params.accountWithoutConfirmationPost Account that must not have any post with confirmation.
   * @param {number} params.first The number of cases to getting.
   * @param {number} params.skip The number of options to skip.
   * @returns {Promise.<Array.<Case>>} A list with cases.
   */
  let getCases = async function ({
    ids,
    searchQuery,
    jurisdictions,
    stage,
    participant,
    admin,
    subject,
    plaintiff,
    judge,
    witness,
    affected,
    accountWithoutConfirmationPost,
    first,
    skip,
  }) {
    const caseEntities = await findCaseEntities(
      ids,
      searchQuery,
      jurisdictions,
      stage,
      participant,
      admin,
      subject,
      plaintiff,
      judge,
      witness,
      affected,
      accountWithoutConfirmationPost,
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
   * Check that the account has any role in specified case.
   *
   * @param {Case} caseObject Case.
   * @param {string} account Account address.
   * @returns {boolean} Result of checking.
   */
  let isAccountHasAnyCaseRole = function (caseObject, account) {
    return caseObject?.participantAccounts?.includes(account?.toLowerCase());
  };

  /**
   * Check that the account has a specified case role.
   *
   * @param {Case} caseObject Case
   * @param {string} account Account address.
   * @param {string} role Case role id.
   * @returns {boolean} Result of checking.
   */
  let isAccountHasCaseRole = function (caseObject, account, role) {
    if (role === CASE_ROLE.admin.id) {
      return caseObject?.adminAccounts?.includes(account?.toLowerCase());
    }
    if (role === CASE_ROLE.subject.id) {
      return caseObject?.subjectAccounts?.includes(account?.toLowerCase());
    }
    if (role === CASE_ROLE.plaintiff.id) {
      return caseObject?.plaintiffAccounts?.includes(account?.toLowerCase());
    }
    if (role === CASE_ROLE.judge.id) {
      return caseObject?.judgeAccounts?.includes(account?.toLowerCase());
    }
    if (role === CASE_ROLE.witness.id) {
      return caseObject?.witnessAccounts?.includes(account?.toLowerCase());
    }
    if (role === CASE_ROLE.affected.id) {
      return caseObject?.affectedAccounts?.includes(account?.toLowerCase());
    }
    return false;
  };

  /**
   * Check that the account has cases that await his confirmation.
   *
   * @param {string} account Account address.
   * @returns {Promise.<boolean>} Result of checking.
   */
  let isAccountHasAwaitingConfirmationCases = async function (account) {
    const cases = await getCases({
      stage: CASE_STAGE.open,
      witness: account,
      accountWithoutConfirmationPost: account,
      first: 1,
    });
    return cases && cases.length > 0;
  };

  /**
   * Check that the account has cases that await his judgment.
   *
   * @param {string} jurisdictions Ids (addresses) of jurisdictions where account is a judge.
   * @returns {Promise.<boolean>} Result of checking.
   */
  let isAccountHasAwaitingJudgingCases = async function (jurisdictions) {
    const cases = await getCases({
      stage: CASE_STAGE.verdict,
      jurisdictions: jurisdictions,
      first: 1,
    });
    return cases && cases.length > 0;
  };

  return {
    getCase,
    getCases,
    getCaseEvents,
    isAccountHasAnyCaseRole,
    isAccountHasCaseRole,
    isAccountHasAwaitingConfirmationCases,
    isAccountHasAwaitingJudgingCases,
  };
}
