import axios from "axios";

export default function useSubgraph() {

  let findAvatarNftEntity = async function (account) {
    const response = await makeSubgraphQuery(getFindAvatarNftEntity(account));
    return response.avatarNftEntities[0];
  }

  let findAvatarNftEntites = async function () {
    const response = await makeSubgraphQuery(getFindAvatarNftEntitiesQuery());
    return response.avatarNftEntities;
  }

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
      tokenUri
    }
  }`;
}

function getFindAvatarNftEntitiesQuery() {
  return `{
    avatarNftEntities(first: 100) {
      id
      owner
      tokenUri
    }
  }`;
}

function getFindJurisdictionMembersQuery() {
  return `{
    jurisdictionParticipantEntities(where: {isMember: true}) {
      id
    }
  }`;
}