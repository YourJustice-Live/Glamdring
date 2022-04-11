import axios from 'axios';

export default function useSubgraph() {
  /**
   * Find the Avatar NFTs for all or only for the specified accounts.
   *
   * @param {Array.<string>} accounts If not null, then the function returns the Avatar NFTs for the specified accounts.
   * @returns {Promise.<Array.<{object}>>} Avatar NFTs with token ID, token owner and token URI.
   */
  let findAvatarNftEntities = async function (accounts) {
    const response = await makeSubgraphQuery(
      getFindAvatarNftEntitiesQuery(accounts),
    );
    return response.avatarNftEntities;
  };

  /**
   * Find the participants of jurisdiction.
   *
   * @param {('members'|'judges'|'admins')} filter If specified, then the function returns the participants by the filter.
   * @returns {Promise.<Array.<{object}>>} Array with accounts of participants.
   */
  let findJurisdictionParticipantEntities = async function (filter) {
    const response = await makeSubgraphQuery(
      getFindJurisdictionParticipantEntitiesQuery(filter),
    );
    return response.jurisdictionParticipantEntities;
  };

  /**
   * Find all jurisdiction rule entities.
   *
   * @returns {Promise.<Array.<{object}>>} Array with jurisdiction rule entities.
   */
  let findJurisdictionRuleEntities = async function () {
    const response = await makeSubgraphQuery(
      getFindJurisdictionRuleEntitiesQuery(),
    );
    return response.jurisdictionRuleEntities;
  };

  /**
   * Find the jurisdiction rule entities by ids.
   *
   * @param {Array.<string>} ids Rule ids.
   * @returns {Promise.<Array.<{object}>>} Array with jurisdiction rule entities.
   */
  let findJurisdictionRuleEntitiesByIds = async function (ids) {
    const response = await makeSubgraphQuery(
      getFindJurisdictionRuleEntitiesQuery(ids, null),
    );
    return response.jurisdictionRuleEntities;
  };

  /**
   * Find the jurisdiction rule entities by action guid.
   *
   * @param {string} actionGuid Action guid.
   * @returns {Promise.<Array.<{object}>>} Array with jurisdiction rule entities.
   */
  let findJurisdictionRuleEntitiesByActionGuid = async function (actionGuid) {
    const response = await makeSubgraphQuery(
      getFindJurisdictionRuleEntitiesQuery(null, actionGuid),
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
   * @param {string} jurisdiction Jurisdiction address.
   * @returns {Promise.<Array.<{object}>>} Array with case entities.
   */
  let findCaseEntities = async function (jurisdiction) {
    const response = await makeSubgraphQuery(
      getFindCaseEntitiesQuery(jurisdiction),
    );
    return response.caseEntities;
  };

  return {
    findAvatarNftEntities,
    findJurisdictionParticipantEntities,
    findJurisdictionRuleEntities,
    findJurisdictionRuleEntitiesByIds,
    findJurisdictionRuleEntitiesByActionGuid,
    findActionEntities,
    findCaseEntities,
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

function getFindAvatarNftEntitiesQuery(accounts) {
  let queryParams = `first: 100`;
  if (accounts && accounts.length == 0) {
    queryParams = `where: {owner: ""}`;
  }
  if (accounts && accounts.length == 1) {
    queryParams = `where: {owner: "${accounts[0]}"}`;
  }
  if (accounts && accounts.length > 1) {
    queryParams = `first: 100, where: {owner_in: ["${accounts.join('","')}"]}`;
  }
  return `{
      avatarNftEntities(${queryParams}) {
        id
        owner
        uri
        reputations {
          id
          domain
          positiveRating
          negativeRating
        }
      }
    }`;
}

function getFindJurisdictionParticipantEntitiesQuery(filter) {
  let queryParams = `first: 100`;
  if (filter === 'members') {
    queryParams = `where: {isMember: true}`;
  }
  if (filter === 'judges') {
    queryParams = `where: {isJudge: true}`;
  }
  if (filter === 'admins') {
    queryParams = `where: {isAdmin: true}`;
  }
  return `{
    jurisdictionParticipantEntities(${queryParams}) {
      id
      isAdmin
      isMember
      isJudge
    }
  }`;
}

function getFindJurisdictionRuleEntitiesQuery(ids, actionGuid) {
  let queryParams = `first: 100`;
  if (ids) {
    queryParams = `first: 100, where: {id_in: ["${ids.join('","')}"]}`;
  }
  if (actionGuid) {
    queryParams = `where: {about: "${actionGuid}"}`;
  }
  return `{
    jurisdictionRuleEntities(${queryParams}) {
      id
      about {
        id
      }
      affected
      uri
      negation
      effectsEnvironmental
      effectsProfessional
      effectsSocial
      effectsPersonal
      confirmationRuling
      confirmationEvidence
      confirmationWitness
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
      rules {
        id
        affected
        uri
        negation
        effectsEnvironmental
        effectsProfessional
        effectsSocial
        effectsPersonal
        confirmationRuling
        confirmationEvidence
        confirmationWitness
      }
    }
  }`;
}

function getFindCaseEntitiesQuery(jurisdiction) {
  let queryParams = `where: {jurisdiction: "${jurisdiction}"}`;
  return `{
    caseEntities(${queryParams}) {
      id
      jurisdiction
      stage
      verdictUri
      rules {
        id
      }
      participants {
        id
        account
        isAdmin
        isSubject
        isPlaintiff
        isJudge
        isWitness
        isAffected
      }
      posts {
        id
        entityRole
        postRole
        uri
      }
    }
  }`;
}
