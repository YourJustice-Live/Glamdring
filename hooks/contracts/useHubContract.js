// eslint-disable-next-line import/extensions
import contractAbi from 'contracts/abi/Hub.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Hooks for hub contract.
 */
export default function useHubContract() {
  const { provider, isNetworkChainIdCorrect } = useWeb3Context();

  function getContract(signerOrProvider) {
    return new Contract(
      process.env.NEXT_PUBLIC_HUB_CONTRACT_ADDRESS,
      contractAbi,
      signerOrProvider,
    );
  }

  /**
   * Create jurisdiction contract.
   *
   * @param {string} name Jurisdiction name.
   * @param {string} uri Jurisdiction metadata.
   * @returns Transaction.
   */
  async function makeJurisdiction(name, uri) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).jurisdictionMake(name, uri);
  }

  return {
    makeJurisdiction,
  };
}
