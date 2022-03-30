import axios from "axios";

export default function useSubgraph() {

  /**
   * Find the Avatar NFTs for all or only for the specified accounts.
   * 
   * @param {Array.<string>} accounts If not null, then the function returns the Avatar NFTs for the specified accounts.
   * @returns {Promise.<Array.<{id: number, owner: string, uri: string, reputations: Array<object>}>>} Avatar NFTs with token ID, token owner and token URI.
   */
  let findAvatarNftEntities = async function (accounts) {
    const response = await makeSubgraphQuery(getFindAvatarNftEntitiesQuery(accounts));
    return response.avatarNftEntities;
  }

  /**
   * Find the members of jurisdiction.
   * 
   * @returns {Promise.<Array.<{id: string, isAdmin: boolean, isMember: boolean, isJudge: boolean}>>} Array with accounts of members.
   */
  let findJurisdictionParticipantEntities = async function () {
    const response = await makeSubgraphQuery(getFindJurisdictionParticipantEntitiesQuery());
    return response.jurisdictionParticipantEntities;
  }

  /**
   * Find the action entities.
   * 
   * @returns {Promise.<Array.<{object}>>} Array with action entities.
   */
  let findActionEntities = async function () {
    const response = await makeSubgraphQuery(getFindActionEntitiesQuery());
    return response.actionEntities;
  }

  return {
    findAvatarNftEntities,
    findJurisdictionParticipantEntities,
    findActionEntities,
  };
}

async function makeSubgraphQuery(query) {
  try {
    const response = await axios.post(process.env.NEXT_PUBLIC_SUBGRAPH_API, { query: query });
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
 * @param {Array<string>} accounts Arrays with accounts.
 */
function getFindAvatarNftEntitiesQuery(accounts) {
  let queryParams = `first: 100`;
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
    }`
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

function getFindActionEntitiesQuery() {
  return `{
    actionEntities(first: 100) {
      id
      guid
      subject
      verb
      object
      tool
      affected
      confirmationRuling
      confirmationEvidence
      confirmationWitness
      uri
    }
  }`
}