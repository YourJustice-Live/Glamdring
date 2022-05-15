// eslint-disable-next-line import/extensions
import contractAbi from 'contracts/abi/ActionRepo.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import useWeb3Context from '../useWeb3Context';

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
   * @param {object} action Information about subject, verb, object,
   * @param {string} uri URI.
   * @returns Transaction.
   */
  async function addAction(action, uri) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).actionAdd(action, uri);
  }

  /**
   * Update an uri for a specified action.
   *
   * @param {string} giud Action GUID (ID).
   * @param {string} uri New URI.
   * @returns Transaction.
   */
  async function updateActionUri(giud, uri) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).actionSetURI(giud, uri);
  }

  return {
    addAction,
    updateActionUri,
  };
}
