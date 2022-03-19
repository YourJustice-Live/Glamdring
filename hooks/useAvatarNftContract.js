import contractJson from "contracts/AvatarNFT.json";
import { Contract, ethers } from 'ethers';
import useProvider from "hooks/useProvider";

/**
 * Hook for AvatarNFT Contract
 * @todo: Validate correct chain before call
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
   * Get count of tokens for specified address
   * 
   * @param string address 
   * @returns 
   */
  async function getBalance(address) {

    const balance = await contract.balanceOf(address);
    const balanceString = balance.toString();

    return balanceString;
  }

  /**
   * Mint avatar for current account
   * 
   * @param string tokenUrl ipsf
   * @returns mint transaction
   */
  async function mint(tokenUrl) {
    return await contract.mint(tokenUrl);
  }

  return { getBalance, mint }

};