import axios from "axios";

export default function useSubgraph() {

  /**
   * Find the Avatar NFT for the specified account.
   * 
   * @param {string} account The account for which you need to find the Avatar NFT.
   * @returns {Promise.<{id: number, owner: string, uri: string}>} Avatar NFT with token ID, token owner and token URI.
   */
  let findAvatarNftEntity = async function (account) {
    const response = await makeSubgraphQuery(getFindAvatarNftEntity(account));
    return response.avatarNftEntities[0];
  }

  /**
   * Find the Avatar NFTs for all or only for the specified accounts.
   * 
   * @param {Array.<string>} accounts If not null, then the function returns the Avatar NFTs for the specified accounts.
   * @returns {Promise.<Array.<{id: number, owner: string, uri: string}>>} Avatar NFTs with token ID, token owner and token URI.
   */
  let findAvatarNftEntites = async function (accounts) {
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
    findAvatarNftEntity,
    findAvatarNftEntites,
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

function getFindAvatarNftEntity(account) {
  return `{
    avatarNftEntities(where: {owner: "${account}"}) {
      id
      owner
      uri
    }
  }`;
}

function getFindAvatarNftEntitiesQuery(accounts) {
  if (accounts) {
    return `{
      avatarNftEntities(first: 100, where: {owner_in: ["${accounts.join('","')}"]}) {
        id
        owner
        uri
      }
    }`
  } else {
    return `{
      avatarNftEntities(first: 100) {
        id
        owner
        uri
      }
    }`;
  }

}

function getFindJurisdictionMembersQuery() {
  return `{
    jurisdictionParticipantEntities(where: {isMember: true}) {
      id
    }
  }`;
}