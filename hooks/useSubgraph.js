import axios from 'axios';
import { PROFILE_ORDER } from 'constants/subgraph';
import { unionWith } from 'lodash';

/**
 * Hook to work with subgraph.
 */
export default function useSubgraph() {
  /**
   * Find the Avatar NFTs for all or only for the specified accounts.
   *
   * @param {Array.<string>} accounts If not null, then the function returns the Avatar NFTs for the specified accounts.
   * @param {string} jurisdiction Jurisdiction address.
   * @param {string} order avatars order.
   * @returns {Promise.<Array.<{object}>>} Avatar NFTs with token ID, token owner and token URI.
   */
  let findAvatarNftEntities = async function (
    accounts,
    jurisdiction,
    first = 10,
    skip = 0,
    order = PROFILE_ORDER.byPositiveRating,
  ) {
    const fixedAccounts = accounts
      ? accounts.map((account) => account.toLowerCase())
      : null;
    const fixedJurisdiction = jurisdiction ? jurisdiction.toLowerCase() : null;
    const response = await makeSubgraphQuery(
      getFindAvatarNftEntitiesQuery(
        fixedAccounts,
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
      (entity1, entity2) => entity1.id === entity2.id,
    );
    const sortedResults = unitedResults.sort((a, b) =>
      Number(a?.totalPositiveRating) < Number(b?.totalPositiveRating) ? 1 : -1,
    );
    return sortedResults;
  };

  /**
   * Find the jurisdiction entities by ids (addresses).
   *
   * @param {Array.<string>} ids Jurisdction ids (addresses).
   * @returns {Promise.<Array.<{object}>>} Jurisdiction entitites.
   */
  let findJurisdictionEntities = async function (ids) {
    const fixedIds = ids ? ids.map((id) => id.toLowerCase()) : null;
    const response = await makeSubgraphQuery(
      getFindJurisdictionEntitiesQuery(fixedIds),
    );
    return response.jurisdictionEntities;
  };

  /**
   * Find the jurisdiction rule entities.
   *
   * @param {Array.<string>} ids A list with jurisdiction rule ids.
   * @param {string} jurisdiction Jurisdiction id (address).
   * @param {string} actionGuid Action id (guid).
   * @returns {Promise.<Array.<{object}>>} Array with rule entities.
   */
  let findJurisdictionRuleEntities = async function (
    ids,
    jurisdiction,
    actionGuid,
  ) {
    const fixedIds = ids ? ids.map((id) => id.toLowerCase()) : null;
    const fixedJurisdiction = jurisdiction ? jurisdiction.toLowerCase() : null;
    const response = await makeSubgraphQuery(
      getFindJurisdictionRuleEntitiesQuery(
        fixedIds,
        fixedJurisdiction,
        actionGuid,
      ),
    );
    return response.jurisdictionRuleEntities;
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
   * @param {string} jurisdiction Jurisdiction address.
   * @param {number} stage Case stage.
   * @param {string} participantAccount Account that must be a participant in the case.
   * @param {number} first The number of cases to getting.
   * @param {number} skip The number of options to skip.
   * @returns {Promise.<Array.<{object}>>} Array with case entities.
   */
  let findCaseEntities = async function (
    ids,
    jurisdiction,
    stage,
    participantAccount,
    first = 5,
    skip = 0,
  ) {
    const fixedIds = ids ? ids.map((id) => id.toLowerCase()) : null;
    const fixedJurisdiction = jurisdiction ? jurisdiction.toLowerCase() : null;
    const response = await makeSubgraphQuery(
      getFindCaseEntitiesQuery(
        fixedIds,
        fixedJurisdiction,
        stage,
        participantAccount,
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
      console.error(response.data.errors);
      throw new Error(`Error making subgraph query: ${response.data.errors}`);
    }
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Could not query the subgraph: ${error.message}`);
  }
}

function getFindAvatarNftEntitiesQuery(
  accounts,
  jurisdiction,
  first,
  skip,
  order,
) {
  let accountsFilter = accounts ? `owner_in: ["${accounts.join('","')}"]` : '';
  let jurisdictionFilter = jurisdiction
    ? `jurisdictions_contains: ["${jurisdiction}"]`
    : '';
  let filterParams = `where: {${accountsFilter}, ${jurisdictionFilter}}`;
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
          domain
          positiveRating
          negativeRating
        }
        totalNegativeRating
        totalPositiveRating
      }
    }`;
}

function getFindAvatarNftEntitiesBySearchQueryQuery(searchQuery) {
  let filterParams1 = `where: {owner_contains_nocase: "${searchQuery}"}`;
  let filterParams2 = `where: {uriFirstName_contains_nocase: "${searchQuery}"}`;
  let filterParams3 = `where: {uriLastName_contains_nocase: "${searchQuery}"}`;
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
  }`;
}

function getFindJurisdictionEntitiesQuery(ids) {
  let idsFilter = ids ? `id_in: ["${ids.join('","')}"]` : '';
  let filterParams = `where: {${idsFilter}}`;
  let paginationParams = `first: 10`;
  return `{
    jurisdictionEntities(${filterParams}, ${paginationParams}) {
      id
      name
      roles {
        id
        roleId
        accounts
        accountsCount
      }
      rules {
        id
      }
      rulesCount
      casesCount
    }
  }`;
}

function getFindJurisdictionRuleEntitiesQuery(ids, jurisdiction, actionGuid) {
  let idsFilter = ids ? `id_in: ["${ids.join('","')}"]` : '';
  let jurisdictionFilter = jurisdiction
    ? `jurisdiction: "${jurisdiction}"`
    : '';
  let actionGuidFilter = actionGuid ? `about: "${actionGuid}"` : '';
  let filterParams = `where: {${idsFilter}, ${jurisdictionFilter}, ${actionGuidFilter}}`;
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
  jurisdiction,
  stage,
  participantAccount,
  first,
  skip,
) {
  let idsFilter = ids ? `id_in: ["${ids.join('","')}"]` : '';
  let jurisdictionFilter = jurisdiction
    ? `jurisdiction: "${jurisdiction}"`
    : '';
  let participantAccountFilter = participantAccount
    ? `participantAccounts_contains: ["${participantAccount}"]`
    : '';
  let stageFilter = stage !== null ? `stage: ${stage}` : '';
  let filterParams = `where: {${idsFilter}, ${jurisdictionFilter}, ${participantAccountFilter}, ${stageFilter}}`;
  let sortParams = `orderBy: createdDate, orderDirection: desc`;
  let paginationParams = `first: ${first}, skip: ${skip}`;
  return `{
    caseEntities(${filterParams}, ${sortParams}, ${paginationParams}) {
      id
      name
      createdDate
      jurisdiction
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
      roles {
        id
        roleId
        accounts
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
      }
      createdDate
      type
      data
    }
  }`;
}
