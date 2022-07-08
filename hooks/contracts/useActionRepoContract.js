// eslint-disable-next-line import/extensions
import contractAbi from 'contracts/abi/ActionRepo.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import useWeb3Context from '../context/useWeb3Context';

/**
 * Hook for ActionRepo Contract.
 */
export default function useActionRepoContract() {
  const { provider, isNetworkChainIdCorrect } = useWeb3Context();

  function getContract(signerOrProvider) {
    return new Contract(
      process.env.NEXT_PUBLIC_ACTION_REPO_CONTRACT_ADDRESS,
      contractAbi,
      signerOrProvider,
    );
  }

  /**
   * Add an action.
   *
   * @param {{subject: string,  verb: string, object: string, tool: string}} action Action object.
   * @param {string} uri URI.
   * @returns Transaction.
   */
  async function addAction(action, uri) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).actionAdd(action, uri);
  }

  return {
    addAction,
  };
}
