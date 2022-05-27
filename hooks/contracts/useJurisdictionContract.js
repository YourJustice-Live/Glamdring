// eslint-disable-next-line import/extensions
import contractAbi from 'contracts/abi/Jurisdiction.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import useWeb3Context from 'hooks/context/useWeb3Context';

/**
 * Hook for juridiction contract.
 */
export default function useJuridictionContract() {
  const { provider, isNetworkChainIdCorrect } = useWeb3Context();

  function getContract(address, signerOrProvider) {
    return new Contract(address, contractAbi, signerOrProvider);
  }

  /**
   * Set uri in jurisdiction contract.
   *
   * @param {string} contractAddress Jurisdiction contract address.
   * @param {string} uri Uri with jurisdiction metadata.
   * @returns Transaction.
   */
  async function setUri(contractAddress, uri) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(
      contractAddress,
      provider?.getSigner(),
    ).setContractURI(uri);
  }

  async function join(contractAddress) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).join();
  }

  async function leave(contractAddress) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).leave();
  }

  async function assignRole(contractAddress, account, role) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).roleAssign(
      account,
      role,
    );
  }

  async function removeRole(contractAddress, account, role) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).roleRemove(
      account,
      role,
    );
  }

  async function addRule(contractAddress, rule, confirmation, effects) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).ruleAdd(
      rule,
      confirmation,
      effects,
    );
  }

  async function updateRule(contractAddress, id, rule, effects) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(contractAddress, provider?.getSigner()).ruleUpdate(
      id,
      rule,
      effects,
    );
  }

  /**
   * Make a case in the jurisdiction.
   *
   * @param {string} contractAddress Jurisdiction contract address.
   * @param {string} name Case name.
   * @param {string} uri Case metadata.
   * @param {Array.<{jurisdiction : string, ruleId: number}>} rules Case rules.
   * @param {Array.<{account : string, role: string}>} roles Case roles.
   * @param {Array.<{entRole : string, uri: string}>} posts Case posts.
   * @returns Transaction.
   */
  async function makeCase(contractAddress, name, uri, rules, roles, posts) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(
      contractAddress,
      provider?.getSigner(),
    ).caseMakeOpen(name, uri, rules, roles, posts);
  }

  return {
    setUri,
    join,
    leave,
    assignRole,
    removeRole,
    addRule,
    updateRule,
    makeCase,
  };
}
