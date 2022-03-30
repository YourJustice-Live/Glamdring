import contractJson from "contracts/ActionRepo.json";
import WrongNetworkError from "errors/WrongNetworkError";
import { Contract } from 'ethers';
import useWeb3Context from "./useWeb3Context";

/**
 * Hook for ActionRepo Contract.
 */
export default function useActionRepoContract() {

  const { provider, network } = useWeb3Context();

  function getContract(signerOrProvider) {
    return new Contract(
      process.env.NEXT_PUBLIC_ACTION_REPO_CONTRACT_ADDRESS,
      contractJson.abi,
      signerOrProvider
    );
  }

  /**
   * Add an action.
   * 
   * @param {object} action Information about subject, verb, object,
   * @param {object} confirmatiom Information about ruling, evidence.
   * @param {string} uri URI.
   * @returns Transaction.
   */
  async function addAction(action, confirmatiom, uri) {
    if (network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).actionAdd(action, confirmatiom, uri);
  }

  return {
    addAction
  }

};