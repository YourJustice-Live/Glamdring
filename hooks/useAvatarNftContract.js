import contractJson from "contracts/AvatarNFT.json";
import { Contract, ethers } from 'ethers';
import useProvider from "hooks/useProvider";

/**
 * Hook for AvatarNFT Contract.
 * 
 * TODO: Validate correct chain before call
 */
export default function useAvatarNftContract() {

  const { provider } = useProvider();

  const defaultProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_CONNECTION_URL);

  const contract = new Contract(
    process.env.NEXT_PUBLIC_AVATAR_NFT_CONTRACT_ADDRESS,
    contractJson.abi,
    provider?.getSigner() || defaultProvider
  );

  /**
   * Mint Avatar NFT for current account.
   * 
   * @param {string} tokenUrl URL to token metadata.
   * @returns Transaction.
   */
  async function mint(tokenUrl) {
    return await contract.mint(tokenUrl);
  }

  /**
   * Update URL to Avatar NFT metadata for specified token of current account.
   * 
   * @param {number} tokenId Token ID.
   * @param {string} tokenUrl New URL to token metadata.
   * @returns Transaction.
   */
  async function update(tokenId, tokenUrl) {
    return await contract.update(tokenId, tokenUrl);
  }

  return { mint, update }

};