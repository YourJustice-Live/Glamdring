// eslint-disable-next-line import/extensions
import contractAbi from 'contracts/abi/Case.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Hook for case contract.
 */
export default function useCaseContract() {
  const { provider, network } = useWeb3Context();

  function getContract(address, signerOrProvider) {
    return new Contract(address, contractAbi, signerOrProvider);
  }

  /**
   * Add a post to specified case contract.
   *
   * @param {string} contractAddress Case contract address.
   * @param {string} entityRole Entity role
   * @param {string} postRole Post role
   * @param {string} uri Uri.
   * @returns Transaction.
   */
  async function addPost(contractAddress, entityRole, postRole, uri) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).post(
      entityRole,
      postRole,
      uri,
    );
  }

  return {
    addPost,
  };
}
