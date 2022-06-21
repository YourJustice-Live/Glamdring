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

  /**
   * Assign a jurisdiction role to the specified token.
   *
   * @param {string} contractAddress Jurisdiction address.
   * @param {string} token Token (profile id).
   * @param {string} role Jurisdiction role name.
   * @returns Transaction.
   */
  async function assignRole(contractAddress, token, role) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(
      contractAddress,
      provider?.getSigner(),
    ).roleAssignToToken(token, role);
  }

  /**
   * Remove a jurisdiction role for the specified token.
   *
   * @param {string} contractAddress Jurisdiction address.
   * @param {string} token Token (profile id).
   * @param {string} role Jurisdiction role.
   * @returns Transaction.
   */
  async function removeRole(contractAddress, token, role) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(
      contractAddress,
      provider?.getSigner(),
    ).roleRemoveFromToken(token, role);
  }

  /**
   * Add rule.
   *
   * @param {string} contractAddress Jurisdiction contract address.
   * @param {{about: string, affected: string, negation: boolean, uri: string}} rule Rule object.
   * @param {{ruling: string, evidence: boolean, witness: number}} confirmation Confirmation object.
   * @param {Array.<{name: string, value: number, direction: boolean}>} effects Effects object.
   * @returns Transaction.
   */
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

  /**
   * Update rule.
   *
   * @param {string} contractAddress Jurisdiction contract address.
   * @param {string} id Rule id in the jurisdiction contract.
   * @param {{about: string, affected: string, negation: boolean, uri: string}} rule Rule object.
   * @param {Array.<{name: string, value: number, direction: boolean}>} effects Effects object.
   * @returns Transaction.
   */
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
   * @param {Array.<{tokenId : string, role: string}>} roles Case roles.
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
