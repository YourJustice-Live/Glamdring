import axios from "axios";
import { create } from "ipfs-http-client";

const client = create(process.env.NEXT_PUBLIC_INFURA_IPFS_API);

export default function useIpfs() {

  let uploadFileToIPFS = async function (file) {

    const created = await client.add(file);
    const cid = created.path;
    const url = `https://ipfs.infura.io/ipfs/${cid}`;

    return { cid, url };
  };

  let uploadJsonToIPFS = async function (json) {

    const created = await client.add(JSON.stringify(json));
    const cid = created.path;
    const url = `https://ipfs.infura.io/ipfs/${cid}`;

    return { cid, url };
  }

  let loadJsonFromIPFS = async function (url) {
    try {
      const response = await axios.get(url);
      if (response.data.errors) {
        console.error(response.data.errors);
        throw new Error(`Error loading json from IPFS: ${response.data.errors}`);
      }
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error(`Could not loading json from IPFS: ${error.message}`);
    }
  }

  return { uploadFileToIPFS, uploadJsonToIPFS, loadJsonFromIPFS };
}