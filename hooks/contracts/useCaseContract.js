// eslint-disable-next-line import/extensions
import contractAbi from 'contracts/abi/Case.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import useWeb3Context from 'hooks/context/useWeb3Context';

/**
 * Hook for case contract.
 */
export default function useCaseContract() {
  const { provider, isNetworkChainIdCorrect } = useWeb3Context();

  function getContract(address, signerOrProvider) {
    return new Contract(address, contractAbi, signerOrProvider);
  }

  /**
   * Assign a role to a specified account.
   *
   * @param {string} contractAddress Case contract address.
   * @param {string} account Account address.
   * @param {string} role Case role name.
   * @returns Transaction.
   */
  async function assignRole(contractAddress, account, role) {
    if (!isNetworkChainIdCorrect) {
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
   * @param {string} token Token (profile id).
   * @param {string} entityRole Case role name.
   * @param {string} uri Uri.
   * @returns Transaction.
   */
  async function addPost(contractAddress, token, entityRole, uri) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).post(
      entityRole,
      token,
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
    if (!isNetworkChainIdCorrect) {
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
    if (!isNetworkChainIdCorrect) {
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
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(
      contractAddress,
      provider?.getSigner(),
    ).stageVerdict(verdict, verdictUri);
  }

  /**
   * Change a case stage to cancelled stage.
   *
   * @param {string} contractAddress Case contract address.
   * @param {string} cancellationUri Uri with cancellation metadata.
   * @returns Transaction.
   */
  async function setStageCancelled(contractAddress, cancellationUri) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(
      contractAddress,
      provider?.getSigner(),
    ).stageCancel(cancellationUri);
  }

  return {
    assignRole,
    addPost,
    setStageOpen,
    setStageVerdict,
    setStageClosed,
    setStageCancelled,
  };
}
