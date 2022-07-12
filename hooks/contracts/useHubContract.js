// eslint-disable-next-line import/extensions
import contractAbi from 'contracts/abi/Hub.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import useWeb3Context from 'hooks/context/useWeb3Context';

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
   * Create a game contract.
   *
   * @param {string} name Game name.
   * @param {string} uri Game metadata.
   * @returns Transaction.
   */
  async function makeGame(name, uri) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).gameMake(name, uri);
  }

  return {
    makeGame,
  };
}
