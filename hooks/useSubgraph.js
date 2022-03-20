import axios from "axios";

export default function useSubgraph() {

  let findAvatarNftEntityByAccount = async function (account) {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_SUBGRAPH_API,
        { query: getFindAvatarNftEntityByAccountQuery(account) }
      );
      if (response.data.errors) {
        console.error(response.data.errors);
        throw new Error(`Error making subgraph query: ${response.data.errors}`);
      }
      const avatarNftEntity = response.data.data.avatarNftEntities[0];
      return avatarNftEntity;
    } catch (error) {
      console.error(error);
      throw new Error(`Could not query the subgraph: ${error.message}`);
    }
  }
  return { findAvatarNftEntityByAccount };
}

function getFindAvatarNftEntityByAccountQuery(account) {
  return `query {
    avatarNftEntities(where: {owner: "${account}"}) {
      id
      owner
      tokenUri
    }
  }`;
}