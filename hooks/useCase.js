import Case from 'classes/Case';
import CaseEvent from 'classes/CaseEvent';
import { CASE_ROLE } from 'constants/contracts';
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
    const cases = await getCases([id], null, null, null, null, null);
    return cases && cases.length > 0 ? cases[0] : null;
  };

  /**
   * Get cases.
   *
   * @param {Array.<string>} ids A list with case ids (addresses).
   * @param {string} jurisdiction Jurisdiction address.
   * @param {number} stage Case stage.
   * @param {string} admin Account that must an admin in the case.
   * @param {number} first The number of cases to getting.
   * @param {number} skip The number of options to skip.
   * @returns {Promise.<Array.<Case>>} A list with cases.
   */
  let getCases = async function (ids, jurisdiction, stage, admin, first, skip) {
    const caseEntities = await findCaseEntities(
      ids,
      jurisdiction,
      stage,
      admin,
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
    if (caseObject?.adminAccounts?.includes(account.toLowerCase())) {
      return true;
    }
    if (caseObject?.subjectAccounts?.includes(account.toLowerCase())) {
      return true;
    }
    if (caseObject?.plaintiffAccounts?.includes(account.toLowerCase())) {
      return true;
    }
    if (caseObject?.judgeAccounts?.includes(account.toLowerCase())) {
      return true;
    }
    if (caseObject?.witnessAccounts?.includes(account.toLowerCase())) {
      return true;
    }
    if (caseObject?.affectedAccounts?.includes(account.toLowerCase())) {
      return true;
    }
    return false;
  };

  /**
   * Check that the account has a specified case role.
   *
   * @param {Case} caseObject Case
   * @param {string} account Account address.
   * @param {string} role Role id.
   * @returns {boolean} Result of checking.
   */
  let isAccountHasCaseRole = function (caseObject, account, role) {
    if (role === CASE_ROLE.admin.id) {
      return caseObject?.adminAccounts?.includes(account.toLowerCase());
    }
    if (role === CASE_ROLE.subject.id) {
      return caseObject?.subjectAccounts?.includes(account.toLowerCase());
    }
    if (role === CASE_ROLE.plaintiff.id) {
      return caseObject?.plaintiffAccounts?.includes(account.toLowerCase());
    }
    if (role === CASE_ROLE.judge.id) {
      return caseObject?.judgeAccounts?.includes(account.toLowerCase());
    }
    if (role === CASE_ROLE.witness.id) {
      return caseObject?.witnessAccounts?.includes(account.toLowerCase());
    }
    if (role === CASE_ROLE.affected.id) {
      return caseObject?.affectedAccounts?.includes(account.toLowerCase());
    }
    return false;
  };

  return {
    getCase,
    getCases,
    getCaseEvents,
    isAccountHasAnyCaseRole,
    isAccountHasCaseRole,
  };
}
