import { create } from "ipfs-http-client";

const client = create(process.env.NEXT_PUBLIC_INFURA_IPFS_API);

export default function useIpfs() {

  let uploadFileToIPFS = async function (file) {

    const created = await client.add(file);
    const cid = created.path;
    const url = `https://ipfs.infura.io/ipfs/${cid}`;

    return [cid, url];
  };

  return [uploadFileToIPFS];
}