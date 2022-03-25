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
   * @returns {Promise.<Array.<{id: string}>>} Array with accounts of members.
   */
  let findJurisdictionMembers = async function () {
    const response = await makeSubgraphQuery(getFindJurisdictionMembersQuery());
    return response.jurisdictionParticipantEntities;
  }

  return {
    findAvatarNftEntities,
    findJurisdictionMembers,
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

function getFindJurisdictionMembersQuery() {
  return `{
    jurisdictionParticipantEntities(where: {isMember: true}) {
      id
    }
  }`;
}