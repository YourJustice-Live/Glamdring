// eslint-disable-next-line import/extensions
import contractAbi from 'contracts/abi/Jurisdiction.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Hook for Juridiction Contract.
 *
 * TODO: Use contract address as function param instead of "process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS".
 */
export default function useJuridictionContract() {
  const { provider, network } = useWeb3Context();

  function getContract(signerOrProvider) {
    return new Contract(
      process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
      contractAbi,
      signerOrProvider,
    );
  }

  async function join() {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).join();
  }

  async function leave() {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).leave();
  }

  async function assignRole(account, role) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).roleAssign(account, role);
  }

  async function removeRole(account, role) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).roleRemove(account, role);
  }

  async function addRule(rule, confirmation, effects) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).ruleAdd(
      rule,
      confirmation,
      effects,
    );
  }

  async function updateRule(id, rule, effects) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).ruleUpdate(
      id,
      rule,
      effects,
    );
  }

  /**
   * Make a case in the jurisdiction.
   *
   * @param {string} name Case name.
   * @param {Array.<{jurisdiction : string, ruleId: number}>} rules Case rules.
   * @param {Array.<{account : string, role: string}>} roles Case roles.
   * @param {Array.<{entRole : string, uri: string}>} posts Case posts.
   * @returns Transaction.
   */
  async function makeCase(name, rules, roles, posts) {
    if (
      network?.chainId?.toString() !== process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID
    ) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).caseMakeOpen(
      name,
      rules,
      roles,
      posts,
    );
  }

  return {
    join,
    leave,
    assignRole,
    removeRole,
    addRule,
    updateRule,
    makeCase,
  };
}
