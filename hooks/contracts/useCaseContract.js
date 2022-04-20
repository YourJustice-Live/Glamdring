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
   * Assign a role to a specified account.
   *
   * @param {string} contractAddress Case contract address.
   * @param {string} account Account address.
   * @param {string} role Role string. For example, "witness".
   * @returns Transaction.
   */
  async function assignRole(contractAddress, account, role) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).roleAssign(
      account,
      role,
    );
  }

  /**
   * Add a post to specified case contract.
   *
   * @param {string} contractAddress Case contract address.
   * @param {string} entityRole Entity role.
   * @param {string} uri Uri.
   * @returns Transaction.
   */
  async function addPost(contractAddress, entityRole, uri) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).post(
      entityRole,
      uri,
    );
  }

  /**
   * Change a case stage to open stage.
   *
   * @param {string} contractAddress Case contract address.
   * @returns Transaction.
   */
  async function setStageOpen(contractAddress) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(
      contractAddress,
      provider?.getSigner(),
    ).stageFile();
  }

  /**
   * Change a case stage to verdict stage.
   *
   * @param {string} contractAddress Case contract address.
   * @returns Transaction.
   */
  async function setStageVerdict(contractAddress) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(
      contractAddress,
      provider?.getSigner(),
    ).stageWaitForVerdict();
  }

  /**
   * Change a case stage to close stage.
   *
   * @param {string} contractAddress Case contract address.
   * @param {Array.<{ruleId: string, decision: boolean}>} verdict Verdict.
   * @param {string} verdictUri Uri with verdict metadata.
   * @returns Transaction.
   */
  async function setStageClosed(contractAddress, verdict, verdictUri) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(
      contractAddress,
      provider?.getSigner(),
    ).stageVerdict(verdict, verdictUri);
  }

  return {
    assignRole,
    addPost,
    setStageOpen,
    setStageVerdict,
    setStageClosed,
  };
}
