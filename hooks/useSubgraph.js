import axios from 'axios';
import { PROFILE_ORDER } from 'constants/subgraph';
import { unionWith } from 'lodash';

/**
 * Hook to work with subgraph.
 */
export default function useSubgraph() {
  /**
   * Find the Avatar NFT entities.
   *
   * @param {Array.<string>} ids Token ids.
   * @param {Array.<string>} owners Token owner accounts.
   * @param {string} jurisdiction Jurisdiction address.
   * @param {number} first The number of entities to getting.
   * @param {number} skip The number of entities to skip.
   * @param {string} order Entities order.
   * @returns {Promise.<Array.<{object}>>} Avatar NFT entities.
   */
  let findAvatarNftEntities = async function (
    ids,
    owners,
    jurisdiction,
    first = 10,
    skip = 0,
    order = PROFILE_ORDER.byPositiveRating,
  ) {
    const fixedOwners = owners
      ? owners.map((owner) => owner.toLowerCase())
      : null;
    const fixedJurisdiction = jurisdiction ? jurisdiction.toLowerCase() : null;
    const response = await makeSubgraphQuery(
      getFindAvatarNftEntitiesQuery(
        ids,
        fixedOwners,
        fixedJurisdiction,
        first,
        skip,
        order,
      ),
    );
    return response.avatarNftEntities;
  };

  /**
   * Find the avatar nft entities by part of address, first name, second name.
   *
   * @param {string} searchQuery Search query.
   * @returns {Promise.<Array.<{object}>>} Some of the avatar nft entities that match the search query.
   */
  let findAvatarNftEntitiesBySearchQuery = async function (searchQuery) {
    const response = await makeSubgraphQuery(
      getFindAvatarNftEntitiesBySearchQueryQuery(searchQuery),
    );
    const unitedResults = unionWith(
      response.result1,
      response.result2,
      response.result3,
      response.result4,
      (entity1, entity2) => entity1.id === entity2.id,
    );
    const sortedResults = unitedResults.sort((a, b) =>
      Number(a?.totalPositiveRating) < Number(b?.totalPositiveRating) ? 1 : -1,
    );
    return sortedResults;
  };

  /**
   * Find the jurisdiction entities.
   *
   * @param {Array.<string>} ids Jurisdction ids (addresses). May be null for get all jurisdictions.
   * @param {string} searchQuery A part of jurisdiction name for searching.
   * @param {string} member Id of token that must be a member in the jurisdiction.
   * @param {string} judge Id of token that must be a judge in the jurisdiction.
   * @param {string} admin If of token that must be an admin in the jurisdiction.
   * @param {number} first The number of jurisdictions to getting.
   * @param {number} skip The number of jurisdictions to skip.
   * @returns {Promise.<Array.<{object}>>} Jurisdiction entitites.
   */
  let findJurisdictionEntities = async function (
    ids,
    searchQuery,
    member,
    judge,
    admin,
    first = 10,
    skip = 0,
  ) {
    const fixedIds = ids ? ids.map((id) => id.toLowerCase()) : null;
    const response = await makeSubgraphQuery(
      getFindJurisdictionEntitiesQuery(
        fixedIds,
        searchQuery,
        member,
        judge,
        admin,
        first,
        skip,
      ),
    );
    return response.jurisdictionEntities;
  };

  /**
   * Find the jurisdiction rule entities.
   *
   * @param {Array.<string>} ids A list with jurisdiction rule ids.
   * @param {string} jurisdiction Jurisdiction id (address).
   * @param {string} actionGuid Action id (guid).
   * @param {bool} isPositive If required to get only positive rules.
   * @param {bool} isNegative If required to get only negative rules.
   * @returns {Promise.<Array.<{object}>>} Array with rule entities.
   */
  let findJurisdictionRuleEntities = async function (
    ids,
    jurisdiction,
    actionGuid,
    isPositive,
    isNegative,
  ) {
    const fixedIds = ids ? ids.map((id) => id.toLowerCase()) : null;
    const fixedJurisdiction = jurisdiction ? jurisdiction.toLowerCase() : null;
    const response = await makeSubgraphQuery(
      getFindJurisdictionRuleEntitiesQuery(
        fixedIds,
        fixedJurisdiction,
        actionGuid,
        isPositive,
        isNegative,
      ),
    );
    return response.jurisdictionRuleEntities;
  };

  /**
   * Get jurisdiction rule entities by search query.
   *
   * @param {string} jurisdiction Jurisdiction id (address).
   * @param {bool} isPositive If required to get only positive rules.
   * @param {bool} isNegative If required to get only negative rules.
   * @param {string} searchQuery Search query.
   * @returns {Promise.<Array.<{object}>>} Array with rule entities.
   */
  let findJurisdictionRuleEntitiesBySearchQuery = async function (
    jurisdiction,
    isPositive,
    isNegative,
    searchQuery,
  ) {
    const response = await makeSubgraphQuery(
      getFindJurisdictionRuleEntitiesBySearchQueryQuery(
        jurisdiction,
        isPositive,
        isNegative,
        searchQuery,
      ),
    );
    const unitedResults = unionWith(
      response.result1,
      response.result2,
      response.result3,
      (entity1, entity2) => entity1.id === entity2.id,
    );
    return unitedResults;
  };

  /**
   * Find the action entities.
   *
   * @param {Array.<string>} guids If not null, then the function returns the action entities for the specified guids.
   * @returns {Promise.<Array.<{object}>>} Array with action entities.
   */
  let findActionEntities = async function (guids) {
    const response = await makeSubgraphQuery(getFindActionEntitiesQuery(guids));
    return response.actionEntities;
  };

  /**
   * Find the case entities.
   *
   * @param {Array.<string>} ids A list with case ids (addresses).
   * @param {string} searchQuery A part of case name for searching.
   * @param {string} jurisdiction Jurisdiction address.
   * @param {number} stage Case stage id.
   * @param {string} participant Id of token that must be a participant in the case.
   * @param {string} admin Id of token that must be an admin in the case.
   * @param {string} subject Id of token that must be a subject in the case.
   * @param {string} plaintiff Id of token that must be a plaintiff in the case.
   * @param {string} judge Id of token that must be a judge in the case.
   * @param {string} witness Id of token that must be a witness in the case.
   * @param {string} affected Id of token that must be an affected in the case.
   * @param {string} participantWithoutConfirmationPost Id of token that must not have any post with confirmation.
   * @param {number} first The number of cases to getting.
   * @param {number} skip The number of options to skip.
   * @returns {Promise.<Array.<{object}>>} Array with case entities.
   */
  let findCaseEntities = async function (
    ids,
    searchQuery,
    jurisdiction,
    stage,
    participant,
    admin,
    subject,
    plaintiff,
    judge,
    witness,
    affected,
    participantWithoutConfirmationPost,
    first = 5,
    skip = 0,
  ) {
    const fixedIds = ids ? ids.map((id) => id.toLowerCase()) : null;
    const fixedJurisdiction = jurisdiction ? jurisdiction.toLowerCase() : null;
    const response = await makeSubgraphQuery(
      getFindCaseEntitiesQuery(
        fixedIds,
        searchQuery,
        fixedJurisdiction,
        stage,
        participant,
        admin,
        subject,
        plaintiff,
        judge,
        witness,
        affected,
        participantWithoutConfirmationPost,
        first,
        skip,
      ),
    );
    return response.caseEntities;
  };

  /**
   * Find the case event entities.
   *
   * @param {Array.<string>} caseIds Case ids.
   * @returns {Promise.<Array.<{object}>>} Array with case event entities.
   */
  let findCaseEventEntities = async function (caseIds) {
    const fixedIds = caseIds ? caseIds.map((id) => id.toLowerCase()) : null;
    const response = await makeSubgraphQuery(
      getFindCaseEventEntitiesQuery(fixedIds),
    );
    return response.caseEventEntities;
  };

  return {
    findAvatarNftEntities,
    findAvatarNftEntitiesBySearchQuery,
    findJurisdictionEntities,
    findJurisdictionRuleEntities,
    findJurisdictionRuleEntitiesBySearchQuery,
    findActionEntities,
    findCaseEntities,
    findCaseEventEntities,
  };
}

async function makeSubgraphQuery(query) {
  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_SUBGRAPH_API, {
      query: query,
    });
    if (response.data.errors) {
      throw new Error(
        `Error making subgraph query: ${JSON.stringify(response.data.errors)}`,
      );
    }
    return response.data.data;
  } catch (error) {
    throw new Error(
      `Could not query the subgraph: ${JSON.stringify(error.message)}`,
    );
  }
}

function getFindAvatarNftEntitiesQuery(
  ids,
  owners,
  jurisdiction,
  first,
  skip,
  order,
) {
  let idsFilter = ids ? `id_in: ["${ids.join('","')}"]` : '';
  let ownersFilter = owners ? `owner_in: ["${owners.join('","')}"]` : '';
  let jurisdictionFilter = jurisdiction
    ? `jurisdictions_contains: ["${jurisdiction}"]`
    : '';
  let filterParams = `where: {${idsFilter}, ${ownersFilter}, ${jurisdictionFilter}}`;
  let sortParams = `orderBy: ${order}, orderDirection: desc`;
  let paginationParams = `first: ${first}, skip: ${skip}`;
  return `{
      avatarNftEntities(${filterParams}, ${sortParams}, ${paginationParams}) {
        id
        owner
        uri
        uriData
        uriImage
        uriFirstName
        uriLastName
        reputations {
          id
          jurisdiction {
            id
            name
          }
          domain
          positiveRating
          negativeRating
        }
        totalNegativeRating
        totalPositiveRating
        totalNegativeCases
        totalPositiveCases
      }
    }`;
}

function getFindAvatarNftEntitiesBySearchQueryQuery(searchQuery) {
  let filterParams1 = `where: {owner_contains_nocase: "${searchQuery}"}`;
  let filterParams2 = `where: {uriFirstName_contains_nocase: "${searchQuery}"}`;
  let filterParams3 = `where: {uriLastName_contains_nocase: "${searchQuery}"}`;
  let filterParams4 = `where: {id: "${searchQuery}"}`;
  let sortParams = `orderBy: totalPositiveRating, orderDirection: desc`;
  let paginationParams = `first: 5, skip: 0`;
  let fields = `
    id
    owner
    uri
    uriData
    uriImage
    uriFirstName
    uriLastName
    reputations {
      id
      jurisdiction {
        id
        name
      }
      domain
      positiveRating
      negativeRating
    } 
    totalNegativeRating
    totalPositiveRating
  `;
  return `{
    result1: avatarNftEntities(${filterParams1}, ${sortParams}, ${paginationParams}) {
      ${fields}
    }
    result2: avatarNftEntities(${filterParams2}, ${sortParams}, ${paginationParams}) {
      ${fields}
    }
    result3: avatarNftEntities(${filterParams3}, ${sortParams}, ${paginationParams}) {
      ${fields}
    }
    result4: avatarNftEntities(${filterParams4}, ${sortParams}, ${paginationParams}) {
      ${fields}
    }
  }`;
}

function getFindJurisdictionEntitiesQuery(
  ids,
  searchQuery,
  member,
  judge,
  admin,
  first,
  skip,
) {
  let idsFilter = ids ? `id_in: ["${ids.join('","')}"]` : '';
  let searchQueryFilter = searchQuery
    ? `name_contains_nocase: "${searchQuery}"`
    : '';
  let memberFilter = member ? `members_contains: ["${member}"]` : ``;
  let judgeFilter = judge ? `judges_contains: ["${judge}"]` : ``;
  let adminFilter = admin ? `admins_contains: ["${admin}"]` : ``;
  let filterParams = `where: {${idsFilter}, ${searchQueryFilter}, ${memberFilter}, ${judgeFilter}, ${adminFilter}}`;
  let sortParams = `orderBy: membersCount, orderDirection: desc`;
  let paginationParams = `first: ${first}, skip: ${skip}`;
  return `{
    jurisdictionEntities(${filterParams}, ${sortParams}, ${paginationParams}) {
      id
      name
      uri
      uriData
      roles {
        id
        roleId
        participants
        participantsCount
      }
      rules {
        id
      }
      rulesCount
      casesCount
    }
  }`;
}

function getFindJurisdictionRuleEntitiesQuery(
  ids,
  jurisdiction,
  actionGuid,
  isPositive,
  isNegative,
) {
  let idsFilter = ids ? `id_in: ["${ids.join('","')}"]` : '';
  let jurisdictionFilter = jurisdiction
    ? `jurisdiction: "${jurisdiction}"`
    : '';
  let actionGuidFilter = actionGuid ? `about: "${actionGuid}"` : '';
  let isPositiveFilter = isPositive === true ? 'isPositive: true' : '';
  let isNegativeFilter = isNegative === true ? 'isPositive: false' : '';
  let filterParams = `where: {${idsFilter}, ${jurisdictionFilter}, ${actionGuidFilter}, ${isPositiveFilter}, ${isNegativeFilter}}`;
  let paginationParams = `first: 100`;
  return `{
    jurisdictionRuleEntities(${filterParams}, ${paginationParams}) {
      id
      about {
        id
      }
      ruleId
      affected
      uri
      uriData
      negation
      confirmationRuling
      confirmationEvidence
      confirmationWitness
      effects {
        name
        direction
        value
      }
      isPositive
    }
  }`;
}

function getFindJurisdictionRuleEntitiesBySearchQueryQuery(
  jurisdiction,
  isPositive,
  isNegative,
  searchQuery,
) {
  let jurisdictionFilter = jurisdiction
    ? `jurisdiction: "${jurisdiction}"`
    : '';
  let isPositiveFilter = isPositive === true ? 'isPositive: true' : '';
  let isNegativeFilter = isNegative === true ? 'isPositive: false' : '';
  let searchQueryFilter1 = `aboutSubject_contains_nocase: "${searchQuery}"`;
  let searchQueryFilter2 = `aboutUriName_contains_nocase: "${searchQuery}"`;
  let searchQueryFilter3 = `affected_contains_nocase: "${searchQuery}"`;
  let filterParams1 = `where: {${jurisdictionFilter}, ${isPositiveFilter},  ${isNegativeFilter}, ${searchQueryFilter1}}`;
  let filterParams2 = `where: {${jurisdictionFilter}, ${isPositiveFilter}, ${isNegativeFilter},  ${searchQueryFilter2}}`;
  let filterParams3 = `where: {${jurisdictionFilter}, ${isPositiveFilter}, ${isNegativeFilter},  ${searchQueryFilter3}}`;
  let paginationParams = `first: 20`;
  let fields = `
    id
    about {
      id
    }
    ruleId
    affected
    uri
    uriData
    negation
    confirmationRuling
    confirmationEvidence
    confirmationWitness
    effects {
      name
      direction
      value
    }
  `;
  return `{
    result1: jurisdictionRuleEntities(${filterParams1}, ${paginationParams}) {
      ${fields}
    }
    result2: jurisdictionRuleEntities(${filterParams2}, ${paginationParams}) {
      ${fields}
    }
    result3: jurisdictionRuleEntities(${filterParams3}, ${paginationParams}) {
      ${fields}
    }
  }`;
}

function getFindActionEntitiesQuery(guids) {
  let queryParams = `first: 100`;
  if (guids && guids.length == 0) {
    queryParams = `where: {id: ""}`;
  }
  if (guids && guids.length == 1) {
    queryParams = `where: {id: "${guids[0]}"}`;
  }
  if (guids && guids.length > 1) {
    queryParams = `first: 100, where: {id_in: ["${guids.join('","')}"]}`;
  }
  return `{
    actionEntities(${queryParams}) {
      id
      subject
      verb
      object
      tool
      uri
      uriData
      rules {
        id
        affected
        uri
        negation
        confirmationRuling
        confirmationEvidence
        confirmationWitness
        effects {
          name
          direction
          value
        }
      }
    }
  }`;
}

function getFindCaseEntitiesQuery(
  ids,
  searchQuery,
  jurisdiction,
  stage,
  participant,
  admin,
  subject,
  plaintiff,
  judge,
  witness,
  affected,
  participantWithoutConfirmationPost,
  first,
  skip,
) {
  let idsFilter = ids ? `id_in: ["${ids.join('","')}"]` : '';
  let searchQueryFilter = searchQuery
    ? `name_contains_nocase: "${searchQuery}"`
    : '';
  let jurisdictionFilter = jurisdiction
    ? `jurisdiction: "${jurisdiction}"`
    : '';
  let participantFilter = participant
    ? `participants_contains: ["${participant}"]`
    : ``;
  let adminFilter = admin ? `admins_contains: ["${admin}"]` : ``;
  let subjectFilter = subject ? `subjects_contains: ["${subject}"]` : ``;
  let plaintiffFilter = plaintiff
    ? `plaintiffs_contains: ["${plaintiff}"]`
    : ``;
  let judgeFilter = judge ? `judges_contains: ["${judge}"]` : ``;
  let witnessFilter = witness ? `witnesses_contains: ["${witness}"]` : ``;
  let affectedFilter = affected ? `affecteds_contains: ["${affected}"]` : ``;
  let notFilter = participantWithoutConfirmationPost
    ? `participantsWithConfirmationPosts_not_contains: ["${participantWithoutConfirmationPost}"]`
    : ``;
  let stageFilter =
    stage !== null && stage !== undefined ? `stage: ${stage}` : '';
  let filterParams = `where: {${idsFilter}, ${jurisdictionFilter}, ${searchQueryFilter}, ${participantFilter}, ${adminFilter}, ${subjectFilter}, ${plaintiffFilter}, ${judgeFilter}, ${witnessFilter}, ${affectedFilter},  ${notFilter}, ${stageFilter}}`;
  let sortParams = `orderBy: createdDate, orderDirection: desc`;
  let paginationParams = `first: ${first}, skip: ${skip}`;
  return `{
    caseEntities(${filterParams}, ${sortParams}, ${paginationParams}) {
      id
      name
      createdDate
      jurisdiction {
        id
        name
      }
      stage
      verdictAuthor
      verdictUri
      verdictUriData
      verdictConfirmedRules {
        id
        ruleId
      }
      cancellationAuthor
      cancellationUri
      cancellationUriData
      rules {
        id
        ruleId
      }
      posts {
        id
        author
        createdDate
        entityRole
        uri
        uriData
        uriType
      }
      participants
      admins
      subjects
      plaintiffs
      judges
      witnesses
      affecteds
    }
  }`;
}

function getFindCaseEventEntitiesQuery(caseIds) {
  let filterParams = `where: {caseEntity_in: ["${caseIds.join('","')}"]}`;
  let sortParams = `orderBy: createdDate, orderDirection: desc`;
  let paginationParams = `first: 30, skip: 0`;
  return `{
    caseEventEntities(${filterParams}, ${sortParams}, ${paginationParams}) {
      id
      caseEntity {
        id
        name
        jurisdiction {
          id
          name
        }
      }
      createdDate
      type
      data
    }
  }`;
}
