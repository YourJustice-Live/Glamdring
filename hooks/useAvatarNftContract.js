import contractJson from "contracts/AvatarNFT.json";
import WrongNetworkError from "errors/WrongNetworkError";
import { Contract } from 'ethers';
import useProvider from "hooks/useProvider";

/**
 * Hook for AvatarNFT Contract.
 */
export default function useAvatarNftContract() {

  const { provider, defaultProvider } = useProvider();

  function getContract(signerOrProvider) {
    return new Contract(
      process.env.NEXT_PUBLIC_AVATAR_NFT_CONTRACT_ADDRESS,
      contractJson.abi,
      signerOrProvider
    );
  }

  /**
   * Mint Avatar NFT for current account.
   * 
   * @param {string} tokenUrl URL to token metadata.
   * @returns Transaction.
   */
  async function mint(tokenUrl) {
    if ((await provider?.getNetwork())?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).mint(tokenUrl);
  }

  /**
   * Update URL to Avatar NFT metadata for specified token of current account.
   * 
   * @param {number} tokenId Token ID.
   * @param {string} tokenUrl New URL to token metadata.
   * @returns Transaction.
   */
  async function update(tokenId, tokenUrl) {
    if ((await provider?.getNetwork())?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).update(tokenId, tokenUrl);
  }

  /**
   * Add positive or negative reputation to Avatar NFT.
   * 
   * @param {number} tokenId Token ID.
   * @param {number} domainId Domain. "0" is a environment domain.
   * @param {number} ratingId Rating. "0" is a negative rating, "1" is a positive rating.
   * @param {number} amount Amount.
   * @returns Transaction.
   */
  async function addReputation(tokenId, domainId, ratingId, amount) {
    if ((await provider?.getNetwork())?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).repAdd(tokenId, domainId, ratingId, amount);
  }

  return {
    mint,
    update,
    addReputation
  }

};