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
   * Find the members of jurisdiction.
   *
   * @returns {Promise.<Array.<{object}>>} Array with accounts of members.
   */
  let findJurisdictionParticipantEntities = async function () {
    const response = await makeSubgraphQuery(
      getFindJurisdictionParticipantEntitiesQuery(),
    );
    return response.jurisdictionParticipantEntities;
  };

  /**
   * Find the jurisdiction rule entities.
   *
   * @param {string} actionGuid If not null, then the function returns the rules for the specified action.
   * @returns Array with jurisdiction rule entities.
   */
  let findJurisdictionRuleEntities = async function (actionGuid) {
    const response = await makeSubgraphQuery(
      getFindJurisdictionRuleEntitiesQuery(actionGuid),
    );
    return response.jurisdictionRuleEntities;
  };

  /**
   * Find the action entities.
   *
   * @returns {Promise.<Array.<{object}>>} Array with action entities.
   */
  let findActionEntities = async function () {
    const response = await makeSubgraphQuery(getFindActionEntitiesQuery());
    return response.actionEntities;
  };

  return {
    findAvatarNftEntities,
    findJurisdictionParticipantEntities,
    findJurisdictionRuleEntities,
    findActionEntities,
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

/**
 *
 * Get query for find avatar nft entities.
 *
 * If "accounts" is null, then return a query for get all entities.
 *
 * If "accounts" is empty array, then return a query for get empty list of entities.
 *
 * @param {Array<string>} accounts Arrays with accounts.
 * @returns Query for subgraph.
 */
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

function getFindJurisdictionParticipantEntitiesQuery() {
  return `{
    jurisdictionParticipantEntities(first: 100) {
      id
      isAdmin
      isMember
      isJudge
    }
  }`;
}

function getFindJurisdictionRuleEntitiesQuery(actionGuid) {
  let queryParams = `first: 100`;
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

function getFindActionEntitiesQuery() {
  return `{
    actionEntities(first: 100) {
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
